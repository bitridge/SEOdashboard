import { useState } from 'react';

export default function PdfModal({ isOpen, onClose, pdfContent }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-3xl w-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">PDF Preview</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <div className="p-4">
                    <iframe
                        src={`data:application/pdf;base64,${pdfContent}`}
                        title="PDF Preview"
                        className="w-full h-96"
                    />
                </div>
            </div>
        </div>
    );
} 