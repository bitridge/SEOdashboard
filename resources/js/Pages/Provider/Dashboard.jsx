import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Provider Dashboard</h2>}
        >
            <Head title="Provider Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Welcome, Provider!</h3>
                            
                            {/* Provider Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-700">Active Projects</h4>
                                    <p className="text-2xl">0</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-700">Total Scans</h4>
                                    <p className="text-2xl">0</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-purple-700">Keywords Tracked</h4>
                                    <p className="text-2xl">0</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
                                        New Project
                                    </button>
                                    <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
                                        Run SEO Scan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 