import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/utils/dateFormat';

export default function Show({ auth, project }) {
    const handleDelete = (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(route('projects.destroy', project.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Project Details</h2>}
        >
            <Head title={`${project.name} - Project Details`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Project Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{project.name}</h1>
                                    <div className="text-gray-400">
                                        Timeline: {formatDate(project.start_date, auth.settings)} - {formatDate(project.end_date, auth.settings)}
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={route('reports.create', { project: project.id })}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-150"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Generate Report
                                    </Link>
                                    <Link
                                        href={route('projects.edit', project.id)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-150"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-150"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {/* Customer Information */}
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-3">Customer</h3>
                                    <div className="text-gray-300">
                                        <p className="font-medium">{project.customer.name}</p>
                                        <p className="text-gray-400">{project.customer.email}</p>
                                    </div>
                                </div>

                                {/* Project Status */}
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-3">Status</h3>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                        project.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                    </span>
                                </div>

                                {/* Providers */}
                                <div className="bg-gray-800 p-4 rounded-lg md:col-span-2">
                                    <h3 className="text-lg font-semibold text-white mb-3">Providers</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.providers.map((provider) => (
                                            <span
                                                key={provider.id}
                                                className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                                            >
                                                {provider.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                {project.description && (
                                    <div className="bg-gray-800 p-4 rounded-lg md:col-span-2">
                                        <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                                        <div 
                                            className="text-gray-300 prose prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{ __html: project.description }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 