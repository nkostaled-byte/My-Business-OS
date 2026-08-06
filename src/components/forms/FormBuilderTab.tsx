import React from 'react';

export const FormBuilderTab: React.FC = () => {
    return (
        <div className="flex gap-8 h-[600px]">
            {/* Fields Sidebar */}
            <div className="w-64 border-r border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Available Fields</h3>
                {['Single line text', 'Email', 'Phone', 'Dropdown', 'Checkbox', 'Paragraph'].map(field => (
                    <div key={field} className="p-3 glass-subtle rounded-xl text-xs font-medium cursor-grab hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        {field}
                    </div>
                ))}
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 flex items-center justify-center text-slate-400">
                Drag and drop fields here to build your form.
                {/* TODO: Implement Drag and Drop canvas and live preview */}
            </div>

            {/* Property Editor */}
            <div className="w-80 border-l border-slate-200 dark:border-slate-800 pl-8">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Property Editor</h3>
                <p className="text-xs text-slate-500">Select a field to edit its properties.</p>
                {/* TODO: Property editor form */}
            </div>
        </div>
    );
};
