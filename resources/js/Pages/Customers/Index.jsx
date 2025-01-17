import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, customers }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Customers</h2>}
        >
            <Head title="Customers" />

            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Customer List</h1>
                <Link
                    href={route('customers.create')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Add Customer
                </Link>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Logo</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Website</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-800">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.logo ? (
                                        <img 
                                            src={`/storage/${customer.logo}`} 
                                            alt={`${customer.name} logo`}
                                            className="h-10 w-10 rounded-full object-cover bg-gray-800"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/40?text=Logo';
                                            }}
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                            <span className="text-gray-400 text-sm">N/A</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">{customer.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">{customer.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.website ? (
                                        <a 
                                            href={customer.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            {customer.website}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">
                                    {new Date(customer.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                    <Link
                                        href={route('customers.show', customer.id)}
                                        className="text-green-400 hover:text-green-300 font-medium"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={route('customers.edit', customer.id)}
                                        className="text-blue-400 hover:text-blue-300 font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('customers.destroy', customer.id)}
                                        method="delete"
                                        as="button"
                                        className="text-red-400 hover:text-red-300 font-medium"
                                        onClick={(e) => {
                                            if (!confirm('Are you sure you want to delete this customer?')) {
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
        </AuthenticatedLayout>
    );
} 