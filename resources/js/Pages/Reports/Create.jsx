import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import QuillEditor from '@/Components/QuillEditor';
import { formatDate } from '@/utils/dateFormat';

export default function Create({ auth, project, seoLogs }) {
    console.log('Project:', project);
    console.log('SEO Logs:', seoLogs);
    
    const [sections, setSections] = useState([
        { id: 1, title: '', content: '', priority: 1, image: null }
    ]);
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [sectionContents, setSectionContents] = useState({1: ''});
    const [sectionImages, setSectionImages] = useState({});
    const [imagePreview, setImagePreview] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        project_id: project.id,
        description: '',
        sections: [],
        seo_logs: [],
        generate_pdf: '0'
    });

    const handleEditorChange = (content) => {
        setEditorContent(content);
        setData('description', content);
    };

    const updateSection = (id, field, value) => {
        const updatedSections = sections.map(section => 
            section.id === id ? { ...section, [field]: value } : section
        );
        setSections(updatedSections);
        
        // Update the form data with the latest sections
        const sectionsData = updatedSections.map(section => ({
            id: section.id,
            title: section.title,
            content: sectionContents[section.id] || '',
            priority: section.priority
        }));
        setData('sections', sectionsData);
    };

    const updateSectionContent = (sectionId, content) => {
        setSectionContents(prev => {
            const updated = { ...prev, [sectionId]: content };
            
            // Update the form data with the latest sections and contents
            const sectionsData = sections.map(section => ({
                id: section.id,
                title: section.title,
                content: updated[section.id] || '',
                priority: section.priority
            }));
            setData('sections', sectionsData);
            
            return updated;
        });
    };

    const handleSubmit = (e, generatePdf = false) => {
        e.preventDefault();
        setValidationErrors({});

        // Create sections data with proper validation
        const sectionsData = sections.map(section => ({
            id: section.id,
            title: section.title.trim(),
            content: sectionContents[section.id]?.trim() || '',
            priority: section.priority
        }));

        // Validate title
        if (!data.title.trim()) {
            setValidationErrors(prev => ({ ...prev, title: 'The report title is required' }));
            return;
        }

        // Validate description
        if (!data.description.trim()) {
            setValidationErrors(prev => ({ ...prev, description: 'The report description is required' }));
            return;
        }

        // Validate sections
        const validSections = sectionsData.filter(
            section => section.title.trim() && section.content.trim()
        );

        if (validSections.length === 0) {
            setValidationErrors(prev => ({ 
                ...prev, 
                sections: 'At least one section with title and content is required' 
            }));
            return;
        }

        const formData = new FormData();
        formData.append('project_id', data.project_id);
        formData.append('title', data.title.trim());
        formData.append('description', data.description.trim());
        formData.append('sections', JSON.stringify(validSections));
        formData.append('seo_logs', JSON.stringify(selectedLogs));
        formData.append('generate_pdf', generatePdf ? '1' : '0');

        // Append section images if they exist
        validSections.forEach(section => {
            if (sectionImages[section.id]) {
                formData.append(`section_images.${section.id}`, sectionImages[section.id]);
            }
        });

        const url = generatePdf ? route('reports.generate-pdf', project.id) : route('reports.store');

        post(url, formData, {
            onError: (errors) => {
                console.error('Server validation errors:', errors);
                setValidationErrors(prev => ({ ...prev, ...errors }));
            },
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleFileChange = (sectionId, e) => {
        const file = e.target.files[0];
        if (file) {
            setSectionImages(prev => ({
                ...prev,
                [sectionId]: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(prev => ({
                    ...prev,
                    [sectionId]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addSection = () => {
        const newId = Math.max(...sections.map(s => s.id), 0) + 1;
        const newSection = {
            id: newId,
            title: '',
            content: '',
            priority: sections.length + 1,
            image: null
        };
        
        setSections(prev => [...prev, newSection]);
        setSectionContents(prev => ({ ...prev, [newId]: '' }));
        
        // Update form data with new section
        const sectionsData = [...sections, newSection].map(section => ({
            id: section.id,
            title: section.title,
            content: sectionContents[section.id] || '',
            priority: section.priority
        }));
        setData('sections', sectionsData);
    };

    const removeSection = (sectionId) => {
        setSections(sections.filter(section => section.id !== sectionId));
        const { [sectionId]: removedContent, ...newSectionContents } = sectionContents;
        const { [sectionId]: removedImage, ...newSectionImages } = sectionImages;
        const { [sectionId]: removedPreview, ...newImagePreview } = imagePreview;
        
        setSectionContents(newSectionContents);
        setSectionImages(newSectionImages);
        setImagePreview(newImagePreview);
    };

    const toggleLogSelection = (logId) => {
        setSelectedLogs(prev => {
            const newSelection = prev.includes(logId) 
                ? prev.filter(id => id !== logId)
                : [...prev, logId];
            setData('seo_logs', newSelection);
            return newSelection;
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Create Report</h2>}
        >
            <Head title="Create Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Show general form errors if any */}
                            {validationErrors.general && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {validationErrors.general}
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="title" value="Report Title" className="text-white" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className={`mt-1 block w-full bg-gray-800 text-white ${
                                        validationErrors.title ? 'border-red-500' : ''
                                    }`}
                                    required
                                />
                                {validationErrors.title && (
                                    <p className="mt-2 text-sm text-red-500">{validationErrors.title}</p>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Report Description" className="text-white" />
                                <QuillEditor
                                    value={editorContent}
                                    onChange={handleEditorChange}
                                    placeholder="Enter report description..."
                                />
                                {validationErrors.description && (
                                    <p className="mt-2 text-sm text-red-500">{validationErrors.description}</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">SEO Logs</h3>
                                <div className="space-y-2">
                                    {seoLogs.map(log => (
                                        <label key={log.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedLogs.includes(log.id)}
                                                onChange={() => toggleLogSelection(log.id)}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            />
                                            <span className="text-white">
                                                {log.work_type} - {new Date(log.work_date).toLocaleDateString()}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-white">Sections</h3>
                                    <button
                                        type="button"
                                        onClick={addSection}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Add Section
                                    </button>
                                </div>

                                {validationErrors.sections && typeof validationErrors.sections === 'string' && (
                                    <p className="text-sm text-red-500">{validationErrors.sections}</p>
                                )}

                                {sections.map((section, index) => (
                                    <div key={section.id} className="bg-gray-800 p-4 rounded-lg space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-white font-medium">Section {index + 1}</h4>
                                            {sections.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSection(section.id)}
                                                    className="text-red-500 hover:text-red-400"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div>
                                            <InputLabel value="Title" className="text-white" />
                                            <TextInput
                                                type="text"
                                                value={section.title}
                                                onChange={e => updateSection(section.id, 'title', e.target.value)}
                                                className={`mt-1 block w-full bg-gray-700 text-white ${
                                                    validationErrors.sections?.[index]?.title ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {validationErrors.sections?.[index]?.title && (
                                                <p className="mt-2 text-sm text-red-500">
                                                    {validationErrors.sections[index].title}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <InputLabel value="Content" className="text-white" />
                                            <QuillEditor
                                                value={sectionContents[section.id] || ''}
                                                onChange={content => updateSectionContent(section.id, content)}
                                                placeholder="Enter section content..."
                                            />
                                            {validationErrors.sections?.[index]?.content && (
                                                <p className="mt-2 text-sm text-red-500">
                                                    {validationErrors.sections[index].content}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <InputLabel value="Image (optional)" className="text-white" />
                                            <input
                                                type="file"
                                                onChange={e => handleFileChange(section.id, e)}
                                                accept="image/*"
                                                className="mt-1 block w-full text-white"
                                            />
                                            {imagePreview[section.id] && (
                                                <img
                                                    src={imagePreview[section.id]}
                                                    alt="Preview"
                                                    className="mt-2 max-h-40 rounded"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    disabled={processing}
                                >
                                    Save Report
                                </button>
                                <button
                                    type="button"
                                    onClick={e => handleSubmit(e, true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    disabled={processing}
                                >
                                    Generate PDF
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 