<?php

return [
    'enabled' => env('AUDIT_LOG_ENABLED', true),

    // Skip logging for these path prefixes.
    'ignore_paths' => [
        'up',
        'api/ping',
        'api/test',
    ],

    // Keys to mask in request payloads.
    'mask_keys' => [
        'password',
        'token',
        'jwt',
        'authorization',
    ],

    // Max payload size to store (bytes). Larger payloads are truncated.
    'max_payload_bytes' => 4096,
];
