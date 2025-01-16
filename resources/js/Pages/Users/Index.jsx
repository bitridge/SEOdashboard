import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, users }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Users</h2>}
        >
            <Head title="Users" />

            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">User List</h1>
                <Link
                    href={route('users.create')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Add User
                </Link>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-800">
                                <td className="px-6 py-4 whitespace-nowrap text-white">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        user.role === 'admin' 
                                            ? 'bg-red-100 text-red-800'
                                            : user.role === 'provider'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                    <Link
                                        href={route('users.edit', user.id)}
                                        className="text-blue-400 hover:text-blue-300 font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('users.destroy', user.id)}
                                        method="delete"
                                        as="button"
                                        className="text-red-400 hover:text-red-300 font-medium"
                                        onClick={(e) => {
                                            if (!confirm('Are you sure you want to delete this user?')) {
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