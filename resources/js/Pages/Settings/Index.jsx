import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Index({ auth, settings }) {
    const [activeTab, setActiveTab] = useState('appearance');
    const { data, setData, post, processing, errors } = useForm({
        theme: settings?.theme || 'dark',
        date_format: settings?.date_format || 'Y-m-d',
        time_format: settings?.time_format || 'H:i',
        timezone: settings?.timezone || 'UTC',
        mail_mailer: settings?.mail_mailer || 'smtp',
        mail_host: settings?.mail_host || '',
        mail_port: settings?.mail_port || '',
        mail_username: settings?.mail_username || '',
        mail_password: settings?.mail_password || '',
        mail_encryption: settings?.mail_encryption || 'tls',
        mail_from_address: settings?.mail_from_address || '',
        mail_from_name: settings?.mail_from_name || 'SEO Dashboard',
        enable_notifications: settings?.enable_notifications || true,
        project_reminder_days: settings?.project_reminder_days || 7,
        report_auto_generation: settings?.report_auto_generation || false,
        report_schedule: settings?.report_schedule || 'monthly',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.update'));
    };

    const tabs = [
        { id: 'appearance', name: 'Appearance & Theme' },
        { id: 'datetime', name: 'Date & Time' },
        { id: 'email', name: 'Email Settings' },
        { id: 'notifications', name: 'Notifications' },
        { id: 'automation', name: 'Automation' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Settings</h2>}
        >
            <Head title="Settings" />

            <div className="py-6">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-700">
                        <nav className="flex space-x-4 px-6" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-500'
                                            : 'border-transparent text-gray-400 hover:text-gray-300'
                                    } py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Appearance & Theme Settings */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="theme" value="Theme" className="text-white" />
                                    <select
                                        id="theme"
                                        name="theme"
                                        value={data.theme}
                                        onChange={(e) => setData('theme', e.target.value)}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="system">System</option>
                                    </select>
                                    <InputError message={errors.theme} className="mt-2" />
                                </div>
                            </div>
                        )}

                        {/* Date & Time Settings */}
                        {activeTab === 'datetime' && (
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="date_format" value="Date Format" className="text-white" />
                                    <select
                                        id="date_format"
                                        name="date_format"
                                        value={data.date_format}
                                        onChange={(e) => setData('date_format', e.target.value)}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    >
                                        <option value="Y-m-d">2024-01-15</option>
                                        <option value="m/d/Y">01/15/2024</option>
                                        <option value="d/m/Y">15/01/2024</option>
                                        <option value="M d, Y">Jan 15, 2024</option>
                                    </select>
                                    <InputError message={errors.date_format} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="time_format" value="Time Format" className="text-white" />
                                    <select
                                        id="time_format"
                                        name="time_format"
                                        value={data.time_format}
                                        onChange={(e) => setData('time_format', e.target.value)}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    >
                                        <option value="H:i">24-hour (14:30)</option>
                                        <option value="h:i A">12-hour (02:30 PM)</option>
                                    </select>
                                    <InputError message={errors.time_format} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="timezone" value="Timezone" className="text-white" />
                                    <select
                                        id="timezone"
                                        name="timezone"
                                        value={data.timezone}
                                        onChange={(e) => setData('timezone', e.target.value)}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">Eastern Time</option>
                                        <option value="America/Chicago">Central Time</option>
                                        <option value="America/Denver">Mountain Time</option>
                                        <option value="America/Los_Angeles">Pacific Time</option>
                                        <option value="Asia/Dubai">Dubai</option>
                                        <option value="Asia/Karachi">Pakistan</option>
                                        <option value="Asia/Kolkata">India</option>
                                    </select>
                                    <InputError message={errors.timezone} className="mt-2" />
                                </div>
                            </div>
                        )}

                        {/* Email Settings */}
                        {activeTab === 'email' && (
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="mail_mailer" value="Mail Provider" className="text-white" />
                                    <select
                                        id="mail_mailer"
                                        name="mail_mailer"
                                        value={data.mail_mailer}
                                        onChange={(e) => setData('mail_mailer', e.target.value)}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    >
                                        <option value="smtp">SMTP</option>
                                        <option value="sendmail">Sendmail</option>
                                        <option value="mailgun">Mailgun</option>
                                    </select>
                                </div>

                                <div>
                                    <InputLabel htmlFor="mail_host" value="SMTP Host" className="text-white" />
                                    <TextInput
                                        id="mail_host"
                                        type="text"
                                        name="mail_host"
                                        value={data.mail_host}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('mail_host', e.target.value)}
                                    />
                                    <InputError message={errors.mail_host} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="mail_port" value="SMTP Port" className="text-white" />
                                    <TextInput
                                        id="mail_port"
                                        type="text"
                                        name="mail_port"
                                        value={data.mail_port}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('mail_port', e.target.value)}
                                    />
                                    <InputError message={errors.mail_port} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="mail_username" value="SMTP Username" className="text-white" />
                                    <TextInput
                                        id="mail_username"
                                        type="text"
                                        name="mail_username"
                                        value={data.mail_username}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('mail_username', e.target.value)}
                                    />
                                    <InputError message={errors.mail_username} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="mail_password" value="SMTP Password" className="text-white" />
                                    <TextInput
                                        id="mail_password"
                                        type="password"
                                        name="mail_password"
                                        value={data.mail_password}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('mail_password', e.target.value)}
                                    />
                                    <InputError message={errors.mail_password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="mail_encryption" value="Encryption" className="text-white" />
                                    <select
                                        id="mail_encryption"
                                        name="mail_encryption"
                                        value={data.mail_encryption}
                                        onChange={(e) => setData('mail_encryption', e.target.value)}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    >
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>

                                <div>
                                    <InputLabel htmlFor="mail_from_address" value="From Address" className="text-white" />
                                    <TextInput
                                        id="mail_from_address"
                                        type="email"
                                        name="mail_from_address"
                                        value={data.mail_from_address}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('mail_from_address', e.target.value)}
                                    />
                                    <InputError message={errors.mail_from_address} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="mail_from_name" value="From Name" className="text-white" />
                                    <TextInput
                                        id="mail_from_name"
                                        type="text"
                                        name="mail_from_name"
                                        value={data.mail_from_name}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('mail_from_name', e.target.value)}
                                    />
                                    <InputError message={errors.mail_from_name} className="mt-2" />
                                </div>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <input
                                        id="enable_notifications"
                                        type="checkbox"
                                        checked={data.enable_notifications}
                                        onChange={(e) => setData('enable_notifications', e.target.checked)}
                                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
                                    />
                                    <InputLabel htmlFor="enable_notifications" value="Enable Email Notifications" className="ml-2 text-white" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="project_reminder_days" value="Project Deadline Reminder (days)" className="text-white" />
                                    <TextInput
                                        id="project_reminder_days"
                                        type="number"
                                        name="project_reminder_days"
                                        value={data.project_reminder_days}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('project_reminder_days', e.target.value)}
                                    />
                                    <InputError message={errors.project_reminder_days} className="mt-2" />
                                </div>
                            </div>
                        )}

                        {/* Automation Settings */}
                        {activeTab === 'automation' && (
                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <input
                                        id="report_auto_generation"
                                        type="checkbox"
                                        checked={data.report_auto_generation}
                                        onChange={(e) => setData('report_auto_generation', e.target.checked)}
                                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
                                    />
                                    <InputLabel htmlFor="report_auto_generation" value="Enable Automatic Report Generation" className="ml-2 text-white" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="report_schedule" value="Report Generation Schedule" className="text-white" />
                                    <select
                                        id="report_schedule"
                                        name="report_schedule"
                                        value={data.report_schedule}
                                        onChange={(e) => setData('report_schedule', e.target.value)}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                    </select>
                                    <InputError message={errors.report_schedule} className="mt-2" />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 