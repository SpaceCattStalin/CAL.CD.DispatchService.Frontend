import { Select } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { selectClassNames } from './inputStyles';

export type SortField = 'createdAt' | 'price';
export type SortDirection = 'asc' | 'desc';

export type SortValue = {
    field: SortField;
    direction: SortDirection;
};

export type SortControlProps = {
    value: SortValue;
    onChange: (value: SortValue) => void;
};

const SORT_FIELD_OPTIONS = [
    { value: 'createdAt', label: 'Created at' },
    { value: 'price', label: 'Price' },
];

const SortControl = ({ value, onChange }: SortControlProps) => {
    return (
        <div className='flex items-center gap-2'>
            <Select
                classNames={selectClassNames}
                size='small'
                value={value.field}
                onChange={(field: SortField) => onChange({ ...value, field })}
                options={SORT_FIELD_OPTIONS}
                style={{ width: 150, borderRadius: 2 }}
            />
            <div className='flex items-center rounded-full border border-[#6a7282] p-0.5 h-[30px] box-border'>
                <button
                    type='button'
                    onClick={() => onChange({ ...value, direction: 'asc' })}
                    aria-pressed={value.direction === 'asc'}
                    aria-label='Sort ascending'
                    className={`flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-colors ${value.direction === 'asc'
                        ? 'bg-[rgb(0,91,168)] text-white'
                        : 'text-[#6a7282] hover:text-[rgb(0,91,168)]'
                        }`}
                >
                    <ArrowUpOutlined style={{ fontSize: 12 }} />
                </button>
                <button
                    type='button'
                    onClick={() => onChange({ ...value, direction: 'desc' })}
                    aria-pressed={value.direction === 'desc'}
                    aria-label='Sort descending'
                    className={`flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-colors ${value.direction === 'desc'
                        ? 'bg-[rgb(0,91,168)] text-white'
                        : 'text-[#6a7282] hover:text-[rgb(0,91,168)]'
                        }`}
                >
                    <ArrowDownOutlined style={{ fontSize: 12 }} />
                </button>
            </div>
        </div>
    );
};

export default SortControl;