import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, report }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Report Details</h2>}
        >
            <Head title={report.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
                                <p className="text-gray-600 mb-4">{report.content}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">Project: {report.project.name}</span>
                                    <span className="text-sm text-gray-500">Created: {new Date(report.created_at).toLocaleDateString()}</span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        report.status === 'published'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {report.status}
                                    </span>
                                </div>
                            </div>
                            <Link
                                href={`/reports/${report.id}/pdf`}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Download PDF
                            </Link>
                        </div>
                    </div>

                    {/* SEO Logs */}
                    {report.seo_logs.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">SEO Activities</h2>
                            <div className="space-y-4">
                                {report.seo_logs.map((log) => (
                                    <div key={log.id} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="text-sm font-medium">{log.work_date}</span>
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                {log.work_type}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{log.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Report Sections */}
                    {report.sections.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Report Sections</h2>
                            <div className="space-y-6">
                                {report.sections.map((section) => (
                                    <div key={section.id} className="border-l-4 border-blue-500 pl-4">
                                        <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                                        <div className="text-gray-600 whitespace-pre-wrap">{section.content}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 