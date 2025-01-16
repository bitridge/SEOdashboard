<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = [
            'theme' => Setting::get('theme', 'dark'),
            'date_format' => Setting::get('date_format', 'Y-m-d'),
            'time_format' => Setting::get('time_format', 'H:i'),
            'timezone' => Setting::get('timezone', 'UTC'),
            'mail_mailer' => Setting::get('mail_mailer', 'smtp'),
            'mail_host' => Setting::get('mail_host'),
            'mail_port' => Setting::get('mail_port'),
            'mail_username' => Setting::get('mail_username'),
            'mail_password' => Setting::get('mail_password'),
            'mail_encryption' => Setting::get('mail_encryption', 'tls'),
            'mail_from_address' => Setting::get('mail_from_address'),
            'mail_from_name' => Setting::get('mail_from_name', 'SEO Dashboard'),
            'enable_notifications' => Setting::get('enable_notifications', true),
            'project_reminder_days' => Setting::get('project_reminder_days', 7),
            'report_auto_generation' => Setting::get('report_auto_generation', false),
            'report_schedule' => Setting::get('report_schedule', 'monthly'),
        ];

        return Inertia::render('Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'required|string|in:light,dark,system',
            'date_format' => 'required|string',
            'time_format' => 'required|string',
            'timezone' => 'required|string',
            'mail_mailer' => 'required|string',
            'mail_host' => 'nullable|string',
            'mail_port' => 'nullable|string',
            'mail_username' => 'nullable|string',
            'mail_password' => 'nullable|string',
            'mail_encryption' => 'required|string',
            'mail_from_address' => 'nullable|email',
            'mail_from_name' => 'required|string',
            'enable_notifications' => 'required|boolean',
            'project_reminder_days' => 'required|integer|min:1|max:30',
            'report_auto_generation' => 'required|boolean',
            'report_schedule' => 'required|string|in:weekly,monthly,quarterly',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        // Update mail configuration
        config([
            'mail.default' => $validated['mail_mailer'],
            'mail.mailers.smtp.host' => $validated['mail_host'],
            'mail.mailers.smtp.port' => $validated['mail_port'],
            'mail.mailers.smtp.username' => $validated['mail_username'],
            'mail.mailers.smtp.password' => $validated['mail_password'],
            'mail.mailers.smtp.encryption' => $validated['mail_encryption'],
            'mail.from.address' => $validated['mail_from_address'],
            'mail.from.name' => $validated['mail_from_name'],
        ]);

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
} 