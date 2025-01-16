import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create({ auth, project, seoLogs }) {
    const [sections, setSections] = useState([
        { id: 1, title: '', content: '', priority: 1 }
    ]);
    const [selectedLogs, setSelectedLogs] = useState([]);

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
            sections: sections,
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
    };

    const updateSection = (id, field, value) => {
        setSections(sections.map(section => 
            section.id === id ? { ...section, [field]: value } : section
        ));
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Generate Report - {project.name}</h2>}
        >
            <Head title="Generate Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={(e) => handleSubmit(e, false)}>
                            {/* Report Information */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Report Information</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <InputLabel htmlFor="title" value="Report Title" />
                                        <TextInput
                                            id="title"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="Enter report title"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="description" value="Description" />
                                        <TextArea
                                            id="description"
                                            className="mt-1 block w-full"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            placeholder="Enter report description"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Select SEO Logs */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Select SEO Logs</h3>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="w-8"></th>
                                                <th className="px-4 py-2 text-left">DATE</th>
                                                <th className="px-4 py-2 text-left">WORK TYPE</th>
                                                <th className="px-4 py-2 text-left">DESCRIPTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {seoLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-gray-100">
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedLogs.includes(log.id)}
                                                            onChange={() => toggleLogSelection(log.id)}
                                                            className="rounded border-gray-300"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">{log.work_date}</td>
                                                    <td className="px-4 py-2">
                                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                            {log.work_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2">{log.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Report Sections */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Report Sections</h3>
                                    <button
                                        type="button"
                                        onClick={addSection}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                                    >
                                        <span className="mr-2">+</span> Add Section
                                    </button>
                                </div>
                                {sections.map((section, index) => (
                                    <div key={section.id} className="mb-6 bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-medium">Section {index + 1}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Priority: {section.priority}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSection(section.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid gap-4">
                                            <div>
                                                <InputLabel value="Section Title" />
                                                <TextInput
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={section.title}
                                                    onChange={e => updateSection(section.id, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel value="Content" />
                                                <TextArea
                                                    className="mt-1 block w-full"
                                                    value={section.content}
                                                    onChange={e => updateSection(section.id, 'content', e.target.value)}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4">
                                <Link
                                    href={route('projects.index')}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </Link>
                                <SecondaryButton
                                    type="button"
                                    onClick={(e) => handleSubmit(e, false)}
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    Preview Report
                                </SecondaryButton>
                                <PrimaryButton
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Generate PDF Report
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 