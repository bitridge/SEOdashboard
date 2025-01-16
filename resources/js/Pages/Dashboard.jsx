import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth, stats, recentActivity, projectStatus, user, currentTime }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}</h1>
                        <p className="text-gray-600">Here's what's happening in your projects</p>
                        <p className="text-sm text-blue-600 mt-2">{currentTime}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {/* Total Customers */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">TOTAL CUSTOMERS</h3>
                            <p className="text-4xl font-bold text-blue-500">{stats.total_customers}</p>
                        </div>

                        {/* Active Projects */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">ACTIVE PROJECTS</h3>
                            <p className="text-4xl font-bold text-green-500">{stats.active_projects}</p>
                        </div>

                        {/* SEO Logs Today */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-cyan-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">SEO LOGS TODAY</h3>
                            <p className="text-4xl font-bold text-cyan-500">{stats.seo_logs_today}</p>
                        </div>

                        {/* Total Reports */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-yellow-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">TOTAL REPORTS</h3>
                            <p className="text-4xl font-bold text-yellow-500">{stats.total_reports}</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-blue-500 rounded-lg p-4 mb-6">
                        <h2 className="text-white text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Link
                                href={route('seo-logs.create')}
                                className="bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Add SEO Log</h3>
                                        <p className="text-sm text-gray-600">Create a new SEO activity log</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={route('projects.index')}
                                className="bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">View Projects</h3>
                                        <p className="text-sm text-gray-600">Browse all projects</p>
                                    </div>
                                </div>
                            </Link>

                            {auth.user.role === 'admin' && (
                                <Link
                                    href={route('customers.index')}
                                    className="bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Manage Customers</h3>
                                            <p className="text-sm text-gray-600">View and edit customers</p>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            <Link
                                href="/reports"
                                className="bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">View Reports</h3>
                                        <p className="text-sm text-gray-600">Access all reports</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Recent Activity</h2>
                                <Link href="#" className="text-sm text-blue-500 hover:text-blue-700">View All</Link>
                            </div>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className={`p-2 rounded-lg ${
                                            activity.type === 'seo_log' ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                            {activity.type === 'seo_log' ? (
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{activity.title}</h3>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">{activity.time_ago}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Status */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Project Status</h2>
                            <div className="space-y-4">
                                {projectStatus.map((project, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{project.name}</span>
                                            <span className="text-sm text-gray-600">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
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
