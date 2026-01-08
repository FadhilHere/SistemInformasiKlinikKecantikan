<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuditLogMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!config('audit.enabled', true)) {
            return $next($request);
        }

        $path = ltrim($request->path(), '/');
        if ($this->isIgnoredPath($path)) {
            return $next($request);
        }

        $start = microtime(true);

        $response = $next($request);

        $durationMs = (int) round((microtime(true) - $start) * 1000);

        $user = $request->user();
        $routeName = optional($request->route())->getName();

        $query = $this->sanitize($request->query());
        $body = $this->sanitize($request->except(['file', 'files']));

        $payloadLimit = (int) config('audit.max_payload_bytes', 4096);
        $query = $this->truncateIfNeeded($query, $payloadLimit);
        $body = $this->truncateIfNeeded($body, $payloadLimit);

        AuditLog::create([
            'user_id' => $user?->idUser,
            'role' => $user?->role,
            'method' => strtoupper($request->method()),
            'path' => '/' . $path,
            'route_name' => $routeName,
            'ip' => $request->ip(),
            'user_agent' => $this->truncateString($request->userAgent(), 255),
            'query_params' => $query,
            'request_body' => $body,
            'status_code' => $response->getStatusCode(),
            'duration_ms' => $durationMs,
        ]);

        return $response;
    }

    private function isIgnoredPath(string $path): bool
    {
        foreach (config('audit.ignore_paths', []) as $ignore) {
            $ignore = trim($ignore, '/');
            if ($ignore !== '' && Str::startsWith($path, $ignore)) {
                return true;
            }
        }

        return false;
    }

    private function sanitize(array $data): array
    {
        $maskKeys = array_map('strtolower', (array) config('audit.mask_keys', []));
        $sanitized = [];

        foreach ($data as $key => $value) {
            $lowerKey = strtolower((string) $key);
            if (in_array($lowerKey, $maskKeys, true)) {
                $sanitized[$key] = '***';
                continue;
            }

            if (is_array($value)) {
                $sanitized[$key] = $this->sanitize($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    private function truncateIfNeeded(array $data, int $maxBytes): array
    {
        $json = json_encode($data);
        if ($json === false) {
            return ['_error' => 'invalid_json'];
        }

        if (strlen($json) <= $maxBytes) {
            return $data;
        }

        return ['_truncated' => substr($json, 0, $maxBytes)];
    }

    private function truncateString(?string $value, int $max): ?string
    {
        if ($value === null) {
            return null;
        }

        if (strlen($value) <= $max) {
            return $value;
        }

        return substr($value, 0, $max);
    }
}
