import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import QuillEditor from '@/Components/QuillEditor';

export default function Create({ auth, project, seoLogs }) {
    const [sections, setSections] = useState([
        { id: 1, title: '', content: '', priority: 1 }
    ]);
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [sectionContents, setSectionContents] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        project_id: project.id,
        title: '',
        description: '',
        sections: sections,
        seo_logs: [],
    });

    const handleSubmit = (e, isPdf = false) => {
        e.preventDefault();
        const formData = {
            ...data,
            description: editorContent,
            sections: sections.map(section => ({
                ...section,
                content: sectionContents[section.id] || ''
            })),
            seo_logs: selectedLogs,
            generate_pdf: isPdf
        };
        post(route('reports.store'), formData);
    };

    const addSection = () => {
        const newSection = {
            id: sections.length + 1,
            title: '',
            content: '',
            priority: sections.length + 1
        };
        setSections([...sections, newSection]);
    };

    const removeSection = (sectionId) => {
        setSections(sections.filter(section => section.id !== sectionId));
        const newSectionContents = { ...sectionContents };
        delete newSectionContents[sectionId];
        setSectionContents(newSectionContents);
    };

    const updateSection = (id, field, value) => {
        if (field === 'content') {
            setSectionContents({
                ...sectionContents,
                [id]: value
            });
        } else {
            setSections(sections.map(section => 
                section.id === id ? { ...section, [field]: value } : section
            ));
        }
    };

    const toggleLogSelection = (logId) => {
        setSelectedLogs(prevSelected => {
            if (prevSelected.includes(logId)) {
                return prevSelected.filter(id => id !== logId);
            } else {
                return [...prevSelected, logId];
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white">Generate Report - {project.name}</h2>}
        >
            <Head title="Generate Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={(e) => handleSubmit(e, false)}>
                            {/* Report Information */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-white mb-4">Report Information</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <InputLabel htmlFor="title" value="Report Title" className="text-white" />
                                        <TextInput
                                            id="title"
                                            type="text"
                                            className="mt-1 block w-full bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="Enter report title"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="description" value="Description" className="text-white" />
                                        <QuillEditor
                                            value={editorContent}
                                            onChange={setEditorContent}
                                            placeholder="Enter report description..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Select SEO Logs */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">Select SEO Logs</h3>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="w-8"></th>
                                                <th className="px-4 py-2 text-left text-white">DATE</th>
                                                <th className="px-4 py-2 text-left text-white">WORK TYPE</th>
                                                <th className="px-4 py-2 text-left text-white">DESCRIPTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {seoLogs.map((log) => (
                                                <tr key={log.id} className="border-t border-gray-700">
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedLogs.includes(log.id)}
                                                            onChange={() => toggleLogSelection(log.id)}
                                                            className="rounded border-gray-700 text-blue-500 focus:ring-blue-500 bg-gray-800"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-white">{log.work_date}</td>
                                                    <td className="px-4 py-2 text-white">{log.work_type}</td>
                                                    <td className="px-4 py-2 text-white">{log.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Report Sections */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">Report Sections</h3>
                                    <button
                                        type="button"
                                        onClick={addSection}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                                    >
                                        Add Section
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {sections.map((section, index) => (
                                        <div key={section.id} className="bg-gray-800 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-white font-medium">Section {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSection(section.id)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="grid gap-4">
                                                <div>
                                                    <InputLabel value="Section Title" className="text-white" />
                                                    <TextInput
                                                        type="text"
                                                        className="mt-1 block w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                                        value={section.title}
                                                        onChange={e => updateSection(section.id, 'title', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="Content" className="text-white" />
                                                    <QuillEditor
                                                        value={sectionContents[section.id] || ''}
                                                        onChange={(content) => updateSection(section.id, 'content', content)}
                                                        placeholder="Enter section content..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4">
                                <Link
                                    href={route('reports.index')}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    onClick={(e) => handleSubmit(e, true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                                >
                                    Generate PDF
                                </button>
                                <PrimaryButton disabled={processing}>
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