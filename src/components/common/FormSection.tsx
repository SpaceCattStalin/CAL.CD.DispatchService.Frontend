import type { ReactNode } from 'react';

export type FormSectionField = {
    key: string;
    label: string;
    input: ReactNode; // already wrapped in <Form.Item name=... noStyle> by the caller
};

export type FormSectionProps = {
    sectionName: string;
    // Each entry is one row. A single field renders full-width;
    // an array of fields renders them side-by-side in that row (e.g. pickup/dropoff dates).
    fields: (FormSectionField | FormSectionField[])[];
};

const fieldLabelClassName = 'text-[12px] text-[rgb(109,109,109)]';

const FormSection = ({ sectionName, fields }: FormSectionProps) => {
    return (
        <div className='rounded-sm flex flex-col border border-gray-500'>
            <div className='text-[#003468] font-semibold bg-gray-200 py-2 px-3 text-[18px]'>
                {sectionName}
            </div>
            <div className='flex flex-col gap-1 px-3 pt-5 pb-8'>
                {fields.map((row) => {
                    const items = Array.isArray(row) ? row : [row];
                    const rowKey = items.map((field) => field.key).join('-');
                    return (
                        <div key={rowKey} className={items.length > 1 ? 'grid grid-cols-2 gap-3' : 'flex flex-col'}>
                            {items.map((field) => (
                                <div key={field.key} className='flex flex-col items-start gap-0.5 w-full'>
                                    <label className={fieldLabelClassName}>{field.label}</label>
                                    {field.input}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormSection;
