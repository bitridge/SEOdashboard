import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/utils/dateFormat';

export default function Index({ auth, reports }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Reports</h2>}
        >
            <Head title="Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Project
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-white">
                                                {report.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white">
                                                {report.project.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white">
                                                {report.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white">
                                                {formatDate(report.created_at, auth.settings)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                                <Link
                                                    href={route('reports.show', report.id)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('reports.edit', report.id)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={route('reports.destroy', report.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this report?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 