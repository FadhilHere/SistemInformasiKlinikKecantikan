<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class JwtFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->bearerToken()) {
            $cookieName = env('JWT_COOKIE', 'jwt_token');
            $token = $request->cookie($cookieName);

            if (!empty($token)) {
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
        }

        return $next($request);
    }
}
