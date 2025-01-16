import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome to SEO Dashboard" />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                {/* Navigation */}
                <nav className="bg-transparent border-b border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-white">
                                    <span className="text-blue-500">SEO</span> Dashboard
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-white hover:text-blue-500 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-white hover:text-blue-500 transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                            </nav>

                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-8">
                                Streamline Your SEO Workflow
                            </h1>
                            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                                Manage projects, track SEO activities, and generate comprehensive reports with our all-in-one SEO management platform.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <a
                                    href="#features"
                                    className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
                                >
                                    Explore Features
                                </a>
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Get Started'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="bg-gray-800 py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
                            <p className="text-gray-400">Everything you need to manage your SEO projects effectively</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Project Management */}
                            <div className="bg-gray-700 p-8 rounded-xl">
                                <div className="text-blue-500 mb-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                <h3 className="text-xl font-bold text-white mb-4">Project Management</h3>
                                <p className="text-gray-300">
                                    Organize and track multiple SEO projects with ease. Assign providers and monitor progress in real-time.
                                        </p>
                                    </div>

                            {/* SEO Activity Logging */}
                            <div className="bg-gray-700 p-8 rounded-xl">
                                <div className="text-blue-500 mb-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                <h3 className="text-xl font-bold text-white mb-4">Activity Logging</h3>
                                <p className="text-gray-300">
                                    Keep detailed records of all SEO activities. Track changes, optimizations, and improvements over time.
                                        </p>
                                    </div>

                            {/* Report Generation */}
                            <div className="bg-gray-700 p-8 rounded-xl">
                                <div className="text-blue-500 mb-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                <h3 className="text-xl font-bold text-white mb-4">Report Generation</h3>
                                <p className="text-gray-300">
                                    Generate professional SEO reports with custom sections and activity summaries. Export to PDF format.
                                        </p>
                                    </div>
                                </div>
                    </div>
                </div>

                {/* Role-based Access Section */}
                <div className="bg-gray-900 py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">Role-based Access Control</h2>
                            <p className="text-gray-400">Different roles for different responsibilities</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Admin Role */}
                            <div className="border border-gray-700 p-6 rounded-xl">
                                <h3 className="text-xl font-bold text-white mb-4">Administrators</h3>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Manage all projects and users</li>
                                    <li>• Assign providers to projects</li>
                                    <li>• Access all reports and logs</li>
                                    <li>• System-wide configuration</li>
                                </ul>
                            </div>

                            {/* Provider Role */}
                            <div className="border border-gray-700 p-6 rounded-xl">
                                <h3 className="text-xl font-bold text-white mb-4">Providers</h3>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Manage assigned projects</li>
                                    <li>• Create SEO activity logs</li>
                                    <li>• Generate project reports</li>
                                    <li>• Track project progress</li>
                                </ul>
                            </div>

                            {/* Customer Role */}
                            <div className="border border-gray-700 p-6 rounded-xl">
                                <h3 className="text-xl font-bold text-white mb-4">Customers</h3>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• View project status</li>
                                    <li>• Access project reports</li>
                                    <li>• Monitor SEO activities</li>
                                    <li>• Track improvements</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-2xl font-bold text-white mb-2">
                                    <span className="text-blue-500">TECHNOTCH</span>
                                </div>
                                <p className="text-gray-400">Empowering your SEO journey</p>
                            </div>
                            <div className="text-gray-400 text-sm">
                                <p>Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                                <p>© {new Date().getFullYear()} TECHNOTCH. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
