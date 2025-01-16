import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import QuillEditor from '@/Components/QuillEditor';
import { useState, useEffect } from 'react';
import { formatDate } from '@/utils/dateFormat';

export default function Edit({ auth, report, seoLogs }) {
    const [sections, setSections] = useState(report.sections || []);
    const [selectedLogs, setSelectedLogs] = useState(report.seo_logs.map(log => log.id) || []);
    const [imagePreview, setImagePreview] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        title: report.title,
        description: report.description,
        type: report.type,
        sections: sections,
        seo_log_ids: selectedLogs,
    });

    useEffect(() => {
        // Initialize image previews for existing section images
        const previews = {};
        sections.forEach((section, index) => {
            if (section.image_path) {
                previews[index] = `/storage/${section.image_path}`;
            }
        });
        setImagePreview(previews);
    }, []);

    const handleSubmit = (e, generatePdf = false) => {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append('_method', 'PUT');
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('type', data.type);
        formData.append('generate_pdf', generatePdf);
        
        sections.forEach((section, index) => {
            formData.append(`sections[${index}][title]`, section.title);
            formData.append(`sections[${index}][content]`, section.content);
            if (section.image instanceof File) {
                formData.append(`sections[${index}][image]`, section.image);
            }
            if (section.id) {
                formData.append(`sections[${index}][id]`, section.id);
            }
        });
        
        selectedLogs.forEach((logId) => {
            formData.append('seo_log_ids[]', logId);
        });

        if (generatePdf) {
            post(route('reports.generate-pdf', report.project_id), {
                data: formData,
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Handle PDF download if needed
                },
                onError: (errors) => {
                    console.error('Form submission errors:', errors);
                }
            });
        } else {
            post(route('reports.update', report.id), {
                data: formData,
                forceFormData: true,
                preserveScroll: true,
                onError: (errors) => {
                    console.error('Form submission errors:', errors);
                }
            });
        }
    };

    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...sections];
        updatedSections[index] = { ...updatedSections[index], [field]: value };
        setSections(updatedSections);
        setData('sections', updatedSections);
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const updatedSections = [...sections];
            updatedSections[index] = { ...updatedSections[index], image: file };
            setSections(updatedSections);
            setData('sections', updatedSections);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(prev => ({
                    ...prev,
                    [index]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addSection = () => {
        setSections([...sections, { title: '', content: '', image: null }]);
    };

    const removeSection = (index) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
        setData('sections', updatedSections);
        
        // Remove image preview if exists
        if (imagePreview[index]) {
            const updatedPreviews = { ...imagePreview };
            delete updatedPreviews[index];
            setImagePreview(updatedPreviews);
        }
    };

    const toggleSeoLog = (logId) => {
        const updatedLogs = selectedLogs.includes(logId)
            ? selectedLogs.filter(id => id !== logId)
            : [...selectedLogs, logId];
        setSelectedLogs(updatedLogs);
        setData('seo_log_ids', updatedLogs);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Edit Report</h2>}
        >
            <Head title="Edit Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="title" value="Title" className="text-white" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    className="mt-1 block w-full bg-gray-800 text-white"
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Description" className="text-white" />
                                <QuillEditor
                                    value={data.description}
                                    onChange={(content) => setData('description', content)}
                                    placeholder="Enter report description..."
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="type" value="Type" className="text-white" />
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="mt-1 block w-full bg-gray-800 text-white border-gray-700 rounded-md shadow-sm"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="custom">Custom</option>
                                </select>
                                <InputError message={errors.type} className="mt-2" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-white">Report Sections</h3>
                                    <SecondaryButton type="button" onClick={addSection}>
                                        Add Section
                                    </SecondaryButton>
                                </div>

                                {sections.map((section, index) => (
                                    <div key={index} className="p-4 bg-gray-800 rounded-lg space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-white">Section {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeSection(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div>
                                            <InputLabel value="Section Title" className="text-white" />
                                            <TextInput
                                                type="text"
                                                value={section.title}
                                                className="mt-1 block w-full bg-gray-700 text-white"
                                                onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Section Content" className="text-white" />
                                            <QuillEditor
                                                value={section.content}
                                                onChange={(content) => handleSectionChange(index, 'content', content)}
                                                placeholder="Enter section content..."
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Section Image" className="text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, index)}
                                                className="mt-1 block w-full text-white"
                                            />
                                            {imagePreview[index] && (
                                                <img
                                                    src={imagePreview[index]}
                                                    alt="Preview"
                                                    className="mt-2 max-w-xs rounded"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">Select SEO Logs</h3>
                                <div className="space-y-2">
                                    {seoLogs.map((log) => (
                                        <label key={log.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedLogs.includes(log.id)}
                                                onChange={() => toggleSeoLog(log.id)}
                                                className="rounded border-gray-700 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                            <span className="text-white">
                                                {formatDate(log.work_date, auth.settings)} - {log.work_type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Link
                                    href={route('reports.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                                >
                                    Cancel
                                </Link>
                                <SecondaryButton
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={processing}
                                >
                                    Generate PDF
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>
                                    Save Report
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 