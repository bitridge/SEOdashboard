import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import QuillEditor from '@/Components/QuillEditor';
import { useState } from 'react';

export default function Edit({ auth, seoLog, projects, workTypes }) {
    const [editorContent, setEditorContent] = useState(seoLog.description || '');

    const { data, setData, post, processing, errors } = useForm({
        project_id: seoLog.project_id,
        work_date: seoLog.work_date,
        work_type: seoLog.work_type,
        description: seoLog.description,
        attachment: null,
        _method: 'PUT'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        data.description = editorContent;
        post(route('seo-logs.update', seoLog.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Edit SEO Log</h2>}
        >
            <Head title="Edit SEO Log" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-6">
                                <InputLabel htmlFor="project_id" value="Project" className="text-white" />
                                <select
                                    id="project_id"
                                    name="project_id"
                                    value={data.project_id}
                                    className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('project_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.project_id} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="work_date" value="Date" className="text-white" />
                                <TextInput
                                    id="work_date"
                                    type="date"
                                    name="work_date"
                                    value={data.work_date}
                                    className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => setData('work_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.work_date} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="work_type" value="Work type" className="text-white" />
                                <select
                                    id="work_type"
                                    name="work_type"
                                    value={data.work_type}
                                    className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('work_type', e.target.value)}
                                    required
                                >
                                    <option value="">Select work type</option>
                                    {workTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.work_type} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="description" value="Description" className="text-white" />
                                <QuillEditor
                                    value={editorContent}
                                    onChange={setEditorContent}
                                    placeholder="Enter your SEO log description..."
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="attachment" value="Attachment" className="text-white" />
                                {seoLog.attachment_path && (
                                    <div className="mb-2">
                                        <a
                                            href={`/storage/${seoLog.attachment_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-400"
                                        >
                                            Current Attachment
                                        </a>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="attachment"
                                    name="attachment"
                                    onChange={e => setData('attachment', e.target.files[0])}
                                    className="mt-1 block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                                />
                                <InputError message={errors.attachment} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <Link
                                    href={route('seo-logs.index')}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Update SEO Log
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 