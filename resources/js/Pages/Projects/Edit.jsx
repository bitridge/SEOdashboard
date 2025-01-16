import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import QuillEditor from '@/Components/QuillEditor';
import { useState } from 'react';

export default function Edit({ auth, project, customers, providers }) {
    const [editorContent, setEditorContent] = useState(project.description || '');

    const { data, setData, put, processing, errors } = useForm({
        name: project.name,
        description: project.description,
        customer_id: project.customer_id,
        provider_ids: project.providers.map(provider => provider.id),
        start_date: project.start_date,
        end_date: project.end_date,
        status: project.status
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        data.description = editorContent;
        put(route('projects.update', project.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Edit Project</h2>}
        >
            <Head title="Edit Project" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" className="text-white" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full bg-gray-800 text-white"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" className="text-white" />
                                    <QuillEditor
                                        value={editorContent}
                                        onChange={setEditorContent}
                                        placeholder="Enter project description..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="customer_id" value="Customer" className="text-white" />
                                    <select
                                        id="customer_id"
                                        name="customer_id"
                                        value={data.customer_id}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select a customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.customer_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="providers" value="Providers" className="text-white" />
                                    <div className="mt-2 space-y-2">
                                        {providers.map((provider) => (
                                            <label key={provider.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={provider.id}
                                                    checked={data.provider_ids.includes(provider.id)}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setData('provider_ids', isChecked
                                                            ? [...data.provider_ids, provider.id]
                                                            : data.provider_ids.filter(id => id !== provider.id)
                                                        );
                                                    }}
                                                    className="rounded border-gray-700 text-blue-500 focus:ring-blue-500 bg-gray-800"
                                                />
                                                <span className="ml-2 text-white">{provider.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.provider_ids} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="start_date" value="Start Date" className="text-white" />
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        name="start_date"
                                        value={data.start_date}
                                        className="mt-1 block w-full bg-gray-800 text-white"
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.start_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="end_date" value="End Date" className="text-white" />
                                    <TextInput
                                        id="end_date"
                                        type="date"
                                        name="end_date"
                                        value={data.end_date}
                                        className="mt-1 block w-full bg-gray-800 text-white"
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.end_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status" className="text-white" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Link
                                        href={route('projects.index')}
                                        className="underline text-sm text-gray-400 hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </Link>

                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Update Project
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 