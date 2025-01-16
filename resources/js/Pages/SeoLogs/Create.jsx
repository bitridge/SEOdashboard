import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Editor } from '@tinymce/tinymce-react';

export default function Create({ auth, projects, workTypes }) {
    const [editorContent, setEditorContent] = useState('');
    const { data, setData, post, processing, errors, progress } = useForm({
        project_id: '',
        work_date: new Date().toISOString().split('T')[0],
        work_type: '',
        description: '',
        attachment: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        data.description = editorContent;
        post(route('seo-logs.store'));
    };

    const handleFileChange = (e) => {
        setData('attachment', e.target.files[0]);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add SEO Log</h2>}
        >
            <Head title="Add SEO Log" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-6">
                                <InputLabel htmlFor="project_id" value="Project" />
                                <select
                                    id="project_id"
                                    name="project_id"
                                    value={data.project_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
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
                                <InputLabel htmlFor="work_date" value="Date" />
                                <TextInput
                                    id="work_date"
                                    type="date"
                                    name="work_date"
                                    value={data.work_date}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('work_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.work_date} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="work_type" value="Work type" />
                                <select
                                    id="work_type"
                                    name="work_type"
                                    value={data.work_type}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
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
                                <InputLabel htmlFor="description" value="Description" />
                                <Editor
                                    apiKey="your-tinymce-api-key"
                                    init={{
                                        height: 300,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                    }}
                                    onEditorChange={(content) => setEditorContent(content)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="attachment" value="Attachments" />
                                <input
                                    type="file"
                                    id="attachment"
                                    name="attachment"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full"
                                />
                                {progress && (
                                    <progress value={progress.percentage} max="100">
                                        {progress.percentage}%
                                    </progress>
                                )}
                                <InputError message={errors.attachment} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton disabled={processing}>Save SEO Log</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 