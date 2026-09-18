import type { ReactNode } from 'react';
import { Form } from 'antd';

export type FormSectionFieldName = string | number | (string | number)[];

export type FormSectionField = {
    key: string;
    label: string;
    // form field path matching the Form.Item's `name`, used to display its validation error.
    // omit for fields with no Form.Item (e.g. read-only displays).
    name?: FormSectionFieldName;
    input: ReactNode; // already wrapped in <Form.Item name=... noStyle> by the caller
};

export type FormSectionProps = {
    sectionName: string;
    // Each entry is one row. A single field renders full-width;
    // an array of fields renders them side-by-side in that row (e.g. pickup/dropoff dates).
    fields: (FormSectionField | FormSectionField[])[];
    className?: string;
};

const fieldLabelClassName = 'text-[12px] text-[rgb(109,109,109)]';
const fieldErrorClassName = 'text-[11px] text-red-500';

// noStyle Form.Items don't render their own error text, so this reads the field's
// current errors from form state and renders them wherever it's placed.
export const FieldError = ({ name }: { name: FormSectionFieldName }) => {
    const form = Form.useFormInstance();
    return (
        <Form.Item noStyle shouldUpdate>
            {() => {
                const errors = form.getFieldError(name);
                return errors.length > 0 ? <span className={fieldErrorClassName}>{errors[0]}</span> : null;
            }}
        </Form.Item>
    );
};

const FormSection = ({ sectionName, fields, className = '' }: FormSectionProps) => {
    return (
        <div className={`rounded-sm flex flex-col border border-gray-500 ${className} self-stretch h-full`}>
            <div className='text-[#003468] font-semibold bg-gray-200 py-2 px-3 text-[18px]'>
                {sectionName}
            </div>
            <div className='flex flex-col gap-1 px-3 pt-5 pb-8 flex-1'>
                {fields.map((row) => {
                    const items = Array.isArray(row) ? row : [row];
                    const rowKey = items.map((field) => field.key).join('-');
                    return (
                        <div key={rowKey} className={items.length > 1 ? 'grid grid-cols-2 gap-3' : 'flex flex-col'}>
                            {items.map((field) => (
                                <div key={field.key} className='flex flex-col items-start gap-0.5 w-full'>
                                    <label className={fieldLabelClassName}>{field.label}</label>
                                    {field.input}
                                    {field.name !== undefined && <FieldError name={field.name} />}
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
