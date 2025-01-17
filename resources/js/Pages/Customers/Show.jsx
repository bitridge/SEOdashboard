import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, customer }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">{customer.name}</h2>}
        >
            <Head title={`Customer - ${customer.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Customer Details Card */}
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{customer.name}</h3>
                                    <div className="space-y-2 text-gray-300">
                                        <p><span className="text-gray-400">Email:</span> {customer.email}</p>
                                        {customer.website && (
                                            <p>
                                                <span className="text-gray-400">Website:</span>{' '}
                                                <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                    {customer.website}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    href={route('projects.create', { customer_id: customer.id })}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Add Project
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Projects List */}
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Projects</h3>
                            {customer.projects && customer.projects.length > 0 ? (
                                <div className="space-y-4">
                                    {customer.projects.map((project) => (
                                        <div key={project.id} className="bg-gray-800 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-white font-medium">{project.name}</h4>
                                                <Link
                                                    href={route('projects.show', project.id)}
                                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                                >
                                                    View Project
                                                </Link>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-2">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <p className="text-gray-400">No projects yet.</p>
                                    <Link
                                        href={route('projects.create', { customer_id: customer.id })}
                                        className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
                                    >
                                        Add the first project
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 