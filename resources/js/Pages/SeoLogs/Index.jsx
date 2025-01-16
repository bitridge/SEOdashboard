import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import { useState } from 'react';

export default function Index({ auth, seoLogs, projects, workTypes, filters }) {
    const [selectedProject, setSelectedProject] = useState(filters.project_id || '');
    const [selectedType, setSelectedType] = useState(filters.work_type || '');
    const [selectedDateRange, setSelectedDateRange] = useState(filters.date_range || '');

    const handleFilter = () => {
        router.get(route('seo-logs.index'), {
            project_id: selectedProject,
            work_type: selectedType,
            date_range: selectedDateRange,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSelectedProject('');
        setSelectedType('');
        setSelectedDateRange('');
        router.get(route('seo-logs.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">SEO Logs</h2>}
        >
            <Head title="SEO Logs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">SEO Logs</h1>
                        <Link
                            href={route('seo-logs.create')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            + Add SEO Log
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                                <select
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">All Projects</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">All Types</option>
                                    {workTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                <select
                                    value={selectedDateRange}
                                    onChange={(e) => setSelectedDateRange(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleFilter}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                            >
                                Filter
                            </button>
                            <button
                                onClick={handleReset}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {seoLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(log.work_date), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {log.project.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {log.work_type.split('_').map(word => 
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                ).join(' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: log.description }} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {log.attachment_path && (
                                                <a
                                                    href={`/storage/${log.attachment_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View File
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('seo-logs.show', log.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={route('seo-logs.edit', log.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={route('seo-logs.destroy', log.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (confirm('Are you sure you want to delete this log?')) {
                                                            router.delete(route('seo-logs.destroy', log.id));
                                                        }
                                                    }}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {seoLogs.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No SEO logs found.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        © 2025 SEO Work Log. All rights reserved.
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 