<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'login', 'logout'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,


    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],


    'exposed_headers' => [],

    'max_age' => 0,
    // JWT bearer → false
];
