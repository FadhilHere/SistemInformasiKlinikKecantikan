<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = true;

    protected $table = 'audit_logs';

    protected $fillable = [
        'user_id',
        'role',
        'method',
        'path',
        'route_name',
        'ip',
        'user_agent',
        'query_params',
        'request_body',
        'status_code',
        'duration_ms',
    ];

    protected $casts = [
        'query_params' => 'array',
        'request_body' => 'array',
        'duration_ms' => 'integer',
        'status_code' => 'integer',
    ];
}
