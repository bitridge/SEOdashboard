import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function QuillEditor({ value, onChange, placeholder = '' }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: placeholder,
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        ['link'],
                        ['clean']
                    ]
                }
            });

            quillRef.current.on('text-change', () => {
                const content = quillRef.current.root.innerHTML;
                onChange(content);
            });
        }

        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            quillRef.current.root.innerHTML = value;
        }
    }, [value]);

    return (
        <div className="mt-1">
            <div className="bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
                <div ref={editorRef} className="min-h-[200px]" />
            </div>
            <style>{`
                .ql-toolbar.ql-snow {
                    background-color: rgb(31, 41, 55);
                    border: none;
                    border-bottom: 1px solid rgb(55, 65, 81);
                }
                .ql-container.ql-snow {
                    border: none;
                    background-color: rgb(31, 41, 55);
                    color: white;
                    font-size: 1rem;
                }
                .ql-editor {
                    min-height: 200px;
                    padding: 1rem;
                }
                .ql-editor.ql-blank::before {
                    color: rgb(156, 163, 175);
                    font-style: normal;
                }
                .ql-picker {
                    color: white !important;
                }
                .ql-stroke {
                    stroke: white !important;
                }
                .ql-fill {
                    fill: white !important;
                }
                .ql-picker-options {
                    background-color: rgb(31, 41, 55) !important;
                    border-color: rgb(55, 65, 81) !important;
                }
                .ql-picker-item {
                    color: white !important;
                }
                .ql-picker-item:hover {
                    color: #60A5FA !important;
                }
                .ql-snow .ql-picker.ql-expanded .ql-picker-options {
                    border-color: rgb(55, 65, 81) !important;
                }
                .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
                    border-color: rgb(55, 65, 81) !important;
                }
                .ql-snow .ql-tooltip {
                    background-color: rgb(31, 41, 55);
                    border-color: rgb(55, 65, 81);
                    color: white;
                }
                .ql-snow .ql-tooltip input[type=text] {
                    background-color: rgb(17, 24, 39);
                    border-color: rgb(55, 65, 81);
                    color: white;
                }
            `}</style>
        </div>
    );
} 