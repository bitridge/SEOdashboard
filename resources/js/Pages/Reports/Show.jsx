import { Head, Link } from '@inertiajs/react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/utils/dateFormat';
import { useState } from 'react';
import PdfModal from '@/Components/PdfModal';

export default function Show({ auth, report }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfContent, setPdfContent] = useState(null);

    const handleGeneratePdf = async () => {
        try {
            const response = await axios.get(route('reports.download', report.id));
            setPdfContent(response.data.content);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    console.log('Report data:', report); // Debug log

    if (!report) {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-white">View Report</h2>}
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-gray-900 p-6 text-white">
                            Report not found
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">View Report</h2>}
        >
            <Head title={`Report - ${report.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Report Header */}
                        <div className="p-6 border-b border-gray-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{report.title}</h1>
                                    <p className="text-gray-400">
                                        Project: <span className="text-white">{report.project?.name}</span>
                                    </p>
                                    <p className="text-gray-400">
                                        Created: <span className="text-white">{report.created_at ? formatDate(report.created_at, auth.settings) : 'N/A'}</span>
                                    </p>
                                    <p className="text-gray-400">
                                        Type: <span className="text-white capitalize">{report.type || 'N/A'}</span>
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <Link
                                        href={route('reports.edit', report.id)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                    >
                                        Edit Report
                                    </Link>
                                    <Link
                                        href={route('reports.download', report.id)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                    >
                                        Download PDF
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Overview Section */}
                        {report.description && (
                            <div className="p-6 border-b border-gray-800">
                                <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
                                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: report.description }} />
                            </div>
                        )}

                        {/* SEO Activities Section */}
                        {report.seo_logs && report.seo_logs.length > 0 && (
                            <div className="p-6 border-b border-gray-800">
                                <h2 className="text-xl font-semibold text-white mb-4">SEO Activities</h2>
                                <div className="space-y-4">
                                    {report.seo_logs.map((log) => (
                                        <div key={log.id} className="bg-gray-800 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">
                                                        {log.work_type?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                    </span>
                                                    <span className="ml-2 text-gray-400">
                                                        {formatDate(log.work_date, auth.settings)}
                                                    </span>
                                                </div>
                                                {log.attachment_path && (
                                                    <a
                                                        href={`/storage/${log.attachment_path}`}
                                                        target="_blank"
                                                        className="text-blue-500 hover:text-blue-400 text-sm"
                                                    >
                                                        View Attachment
                                                    </a>
                                                )}
                                            </div>
                                            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: log.description }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Report Sections */}
                        {report.sections && report.sections.length > 0 && (
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Report Sections</h2>
                                <div className="space-y-6">
                                    {report.sections.map((section, index) => (
                                        <div key={section.id || index} className="bg-gray-800 p-4 rounded-lg">
                                            <h3 className="text-lg font-medium text-white mb-3">{section.title}</h3>
                                            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                                            {section.image_path && (
                                                <div className="mt-4">
                                                    <img
                                                        src={`/storage/${section.image_path}`}
                                                        alt={section.title}
                                                        className="max-w-xl rounded-lg"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PDF Modal */}
            <PdfModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pdfContent={pdfContent} />
        </AuthenticatedLayout>
    );
} 