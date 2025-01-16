import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <nav className="bg-gray-900 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <div className="text-2xl font-bold text-white">
                                        <span className="text-blue-500">SEO</span> Dashboard
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')} className="text-gray-300 hover:text-white text-lg font-medium">
                                    Dashboard
                                </NavLink>
                                {user.role === 'admin' && (
                                    <>
                                        <NavLink href={route('customers.index')} active={route().current('customers.*')} className="text-gray-300 hover:text-white text-lg font-medium">
                                            Customers
                                        </NavLink>
                                        <NavLink href={route('users.index')} active={route().current('users.*')} className="text-gray-300 hover:text-white text-lg font-medium">
                                            Users
                                        </NavLink>
                                    </>
                                )}
                                <NavLink href={route('projects.index')} active={route().current('projects.*')} className="text-gray-300 hover:text-white text-lg font-medium">
                                    Projects
                                </NavLink>
                                <NavLink href={route('seo-logs.index')} active={route().current('seo-logs.*')} className="text-gray-300 hover:text-white text-lg font-medium">
                                    SEO Logs
                                </NavLink>
                                <NavLink href={route('reports.index')} active={route().current('reports.*')} className="text-gray-300 hover:text-white text-lg font-medium">
                                    Reports
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-300 hover:text-white focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')} className="text-gray-900 hover:bg-gray-100">Profile</Dropdown.Link>
                                        {user.role === 'admin' && (
                                            <Dropdown.Link href={route('settings.index')} className="text-gray-900 hover:bg-gray-100">Settings</Dropdown.Link>
                                        )}
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-gray-900 hover:bg-gray-100">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')} className="text-gray-300">
                            Dashboard
                        </ResponsiveNavLink>
                        {user.role === 'admin' && (
                            <>
                                <ResponsiveNavLink href={route('customers.index')} active={route().current('customers.*')} className="text-gray-300">
                                    Customers
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('users.index')} active={route().current('users.*')} className="text-gray-300">
                                    Users
                                </ResponsiveNavLink>
                            </>
                        )}
                        <ResponsiveNavLink href={route('projects.index')} active={route().current('projects.*')} className="text-gray-300">
                            Projects
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('seo-logs.index')} active={route().current('seo-logs.*')} className="text-gray-300">
                            SEO Logs
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('reports.index')} active={route().current('reports.*')} className="text-gray-300">
                            Reports
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-700">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-300">{user.name}</div>
                            <div className="font-medium text-sm text-gray-400">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')} className="text-gray-300">Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-gray-300">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-100">
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-900 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-2xl font-bold text-white mb-2">
                                <span className="text-blue-500">TECHNOTCH</span>
                            </div>
                            <p className="text-gray-400">Empowering your SEO journey</p>
                        </div>
                        <div className="text-gray-400 text-sm">
                            <p>© {new Date().getFullYear()} TECHNOTCH. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
