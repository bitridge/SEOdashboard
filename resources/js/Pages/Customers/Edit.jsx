import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useEffect, useState } from 'react';

export default function Edit({ auth, customer }) {
    const [logoPreview, setLogoPreview] = useState(null);
    const { data, setData, post, processing, errors, reset, progress } = useForm({
        name: customer.name || '',
        email: customer.email || '',
        website: customer.website || '',
        logo: null,
        _method: 'PUT'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customers.update', customer.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(null);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Edit Customer</h2>}
        >
            <Head title="Edit Customer" />

            <div className="py-6">
                <div className="bg-gray-900 rounded-lg overflow-hidden p-6">
                    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                        <div>
                            <InputLabel htmlFor="name" value="Name" className="text-white" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" className="text-white" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="website" value="Website" className="text-white" />
                            <TextInput
                                id="website"
                                type="url"
                                name="website"
                                value={data.website}
                                className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                onChange={(e) => setData('website', e.target.value)}
                            />
                            <InputError message={errors.website} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="logo" value="Logo" className="text-white" />
                            {(logoPreview || customer.logo) && (
                                <div className="mt-2 mb-4">
                                    <p className="text-sm text-gray-400 mb-2">
                                        {logoPreview ? 'New Logo Preview:' : 'Current Logo:'}
                                    </p>
                                    <img 
                                        src={logoPreview || `/storage/${customer.logo}`}
                                        alt={logoPreview ? 'New Logo Preview' : 'Current Logo'}
                                        className="h-20 w-20 rounded-lg object-cover bg-gray-800"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/80?text=Logo';
                                        }}
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                id="logo"
                                name="logo"
                                onChange={handleLogoChange}
                                className="mt-1 block w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
                                accept="image/*"
                            />
                            <p className="mt-1 text-sm text-gray-400">Recommended size: 100x100 pixels</p>
                            <InputError message={errors.logo} className="mt-2" />
                            {progress && (
                                <progress value={progress.percentage} max="100" className="mt-2 w-full">
                                    {progress.percentage}%
                                </progress>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                {processing ? 'Updating...' : 'Update Customer'}
                            </button>
                            <Link
                                href={route('customers.index')}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 