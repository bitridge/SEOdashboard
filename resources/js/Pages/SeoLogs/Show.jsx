import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/utils/dateFormat';

export default function Show({ auth, seoLog }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">SEO Log Details</h2>}
        >
            <Head title="SEO Log Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Project Information */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-white mb-4">Project Information</h3>
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <p className="text-white mb-2">
                                        <span className="font-semibold">Project:</span> {seoLog.project.name}
                                    </p>
                                    <p className="text-white mb-2">
                                        <span className="font-semibold">Provider:</span> {seoLog.provider.name}
                                    </p>
                                    <p className="text-white mb-2">
                                        <span className="font-semibold">Date:</span> {formatDate(seoLog.work_date, auth.settings)}
                                    </p>
                                    <p className="text-white">
                                        <span className="font-semibold">Work Type:</span> {seoLog.work_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div 
                                        className="prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: seoLog.description }}
                                    />
                                </div>
                            </div>

                            {/* Attachment */}
                            {seoLog.attachment_path && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-white mb-4">Attachment</h3>
                                    <div className="bg-gray-800 rounded-lg p-4">
                                        <a
                                            href={`/storage/${seoLog.attachment_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-400 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            Download Attachment
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end space-x-4">
                                <Link
                                    href={route('seo-logs.index')}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                                >
                                    Back to Logs
                                </Link>
                                {(auth.user.role === 'admin' || auth.user.id === seoLog.provider_id) && (
                                    <>
                                        <Link
                                            href={route('seo-logs.edit', seoLog.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                                        >
                                            Edit Log
                                        </Link>
                                        <Link
                                            href={route('seo-logs.destroy', seoLog.id)}
                                            method="delete"
                                            as="button"
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                                            onClick={(e) => {
                                                if (!confirm('Are you sure you want to delete this log?')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            Delete Log
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 