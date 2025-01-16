import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import QuillEditor from '@/Components/QuillEditor';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        customer_id: '',
        provider_id: '',
        start_date: '',
        end_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Create Project</h2>}
        >
            <Head title="Create Project" />

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
                                        value={data.description}
                                        onChange={(content) => setData('description', content)}
                                        placeholder="Enter project description..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="customer_id" value="Customer" className="text-white" />
                                    <TextInput
                                        id="customer_id"
                                        type="text"
                                        name="customer_id"
                                        value={data.customer_id}
                                        className="mt-1 block w-full bg-gray-800 text-white"
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.customer_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="provider_id" value="Provider" className="text-white" />
                                    <TextInput
                                        id="provider_id"
                                        type="text"
                                        name="provider_id"
                                        value={data.provider_id}
                                        className="mt-1 block w-full bg-gray-800 text-white"
                                        onChange={(e) => setData('provider_id', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.provider_id} className="mt-2" />
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

                                <div className="flex items-center justify-end mt-4">
                                    <Link
                                        href={route('projects.index')}
                                        className="underline text-sm text-gray-400 hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </Link>

                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Create Project
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