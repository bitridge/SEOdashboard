import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Edit({ auth, seoLog }) {
    const { data, setData, post, processing, errors } = useForm({
        work_type: seoLog.work_type || '',
        work_date: seoLog.work_date || '',
        description: seoLog.description || '',
        attachment: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seo-logs.update', seoLog.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success
            },
        });
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link'
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Edit SEO Log</h2>}
        >
            <Head title="Edit SEO Log" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="work_type" value="Work Type" className="text-white" />
                                    <select
                                        id="work_type"
                                        className="mt-1 block w-full border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.work_type}
                                        onChange={e => setData('work_type', e.target.value)}
                                    >
                                        <option value="">Select Work Type</option>
                                        <option value="on_page">On Page SEO</option>
                                        <option value="off_page">Off Page SEO</option>
                                        <option value="technical">Technical SEO</option>
                                        <option value="content">Content Creation</option>
                                        <option value="analytics">Analytics & Reporting</option>
                                    </select>
                                    <InputError message={errors.work_type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="work_date" value="Work Date" className="text-white" />
                                    <TextInput
                                        id="work_date"
                                        type="date"
                                        className="mt-1 block w-full border-gray-700 bg-gray-800 text-white"
                                        value={data.work_date}
                                        onChange={e => setData('work_date', e.target.value)}
                                    />
                                    <InputError message={errors.work_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" className="text-white" />
                                    <div className="mt-1">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.description}
                                            onChange={content => setData('description', content)}
                                            modules={modules}
                                            formats={formats}
                                            className="bg-gray-800 text-white rounded-md"
                                        />
                                    </div>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="mt-16">
                                    <InputLabel htmlFor="attachment" value="Attachment" className="text-white" />
                                    <input
                                        type="file"
                                        id="attachment"
                                        className="mt-1 block w-full text-white"
                                        onChange={e => setData('attachment', e.target.files[0])}
                                    />
                                    <InputError message={errors.attachment} className="mt-2" />
                                    {seoLog.attachment_path && (
                                        <div className="mt-2 text-sm text-gray-400">
                                            Current attachment: {seoLog.attachment_path}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton
                                        className="ml-4"
                                        disabled={processing}
                                    >
                                        Update SEO Log
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .ql-toolbar {
                    background-color: #374151 !important;
                    border-color: #4B5563 !important;
                    border-top-left-radius: 0.375rem;
                    border-top-right-radius: 0.375rem;
                }
                .ql-container {
                    background-color: #1F2937 !important;
                    border-color: #4B5563 !important;
                    border-bottom-left-radius: 0.375rem;
                    border-bottom-right-radius: 0.375rem;
                    min-height: 200px;
                }
                .ql-editor {
                    color: white !important;
                }
                .ql-stroke {
                    stroke: #9CA3AF !important;
                }
                .ql-fill {
                    fill: #9CA3AF !important;
                }
                .ql-picker {
                    color: #9CA3AF !important;
                }
                .ql-picker-options {
                    background-color: #374151 !important;
                    color: white !important;
                }
            `}</style>
        </AuthenticatedLayout>
    );
} 