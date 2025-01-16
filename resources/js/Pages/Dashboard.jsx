import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth, stats, recentActivity, projectStatus, user, currentTime }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-none">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="pt-0 pb-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">Welcome, {user.name}</h1>
                                <p className="text-gray-300">Here's what's happening in your projects</p>
                            </div>
                            <p className="text-blue-400 text-sm font-medium">{currentTime}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {/* Total Customers */}
                        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Customers</h3>
                            <p className="text-4xl font-bold text-blue-400">{stats.total_customers}</p>
                        </div>

                        {/* Active Projects */}
                        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">Active Projects</h3>
                            <p className="text-4xl font-bold text-green-400">{stats.active_projects}</p>
                        </div>

                        {/* SEO Logs Today */}
                        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="bg-cyan-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">SEO Logs Today</h3>
                            <p className="text-4xl font-bold text-cyan-400">{stats.seo_logs_today}</p>
                        </div>

                        {/* Total Reports */}
                        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="bg-yellow-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Reports</h3>
                            <p className="text-4xl font-bold text-yellow-400">{stats.total_reports}</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 mb-6 shadow-lg border border-blue-700">
                        <h2 className="text-white text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Link
                                href={route('seo-logs.create')}
                                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-700 shadow-md"
                            >
                                <div className="flex items-center">
                                    <div className="bg-blue-900 p-3 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Add SEO Log</h3>
                                        <p className="text-sm text-gray-400">Create a new SEO activity log</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={route('projects.index')}
                                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-700 shadow-md"
                            >
                                <div className="flex items-center">
                                    <div className="bg-green-900 p-3 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">View Projects</h3>
                                        <p className="text-sm text-gray-400">Browse all projects</p>
                                    </div>
                                </div>
                            </Link>

                            {auth.user.role === 'admin' && (
                                <Link
                                    href={route('customers.index')}
                                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-700 shadow-md"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-purple-900 p-3 rounded-lg mr-3">
                                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Manage Customers</h3>
                                            <p className="text-sm text-gray-400">View and edit customers</p>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            <Link
                                href={route('reports.index')}
                                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-700 shadow-md"
                            >
                                <div className="flex items-center">
                                    <div className="bg-yellow-900 p-3 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">View Reports</h3>
                                        <p className="text-sm text-gray-400">Access all reports</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg p-6 border border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                                <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All</Link>
                            </div>
                            <div className="space-y-6">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className={`p-3 rounded-lg ${
                                            activity.type === 'seo_log' ? 'bg-green-900' : 'bg-blue-900'
                                        }`}>
                                            {activity.type === 'seo_log' ? (
                                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {activity.title.replace(/<[^>]*>/g, '')}
                                            </h3>
                                            <p className="text-gray-400 mt-1">
                                                {activity.description.replace(/<[^>]*>/g, '')}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">{activity.time_ago}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Status */}
                        <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-6">Project Status</h2>
                            <div className="space-y-6">
                                {projectStatus.map((project, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-300 font-medium">{project.name}</span>
                                            <span className="text-blue-400 font-medium">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
