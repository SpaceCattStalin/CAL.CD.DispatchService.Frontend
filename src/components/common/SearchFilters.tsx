import { Form, Input, DatePicker, InputNumber, Collapse, Checkbox } from 'antd';
import type { FormInstance } from 'antd';
import { createStaticStyles } from 'antd-style';
import { SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import type { DispatchStatus } from '../../types/Dispatch';
import { inputClassNames, numberClassNames, collapseClassNames } from './inputStyles';

const { RangePicker } = DatePicker;

const DISPATCH_STATUS_OPTIONS: { label: string; value: DispatchStatus; }[] = [
    { label: 'Not Signed', value: 'NotSigned' },
    { label: 'Pending Pickup', value: 'PendingPickup' },
    { label: 'Pending Delivery', value: 'PendingDelivery' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Canceled', value: 'Canceled' },
];

export type DispatchSearchFilters = {
    dispatchId: string | null;
    status: DispatchStatus[] | null;
    pickupDateRange: [Dayjs, Dayjs] | null;
    dropoffDateRange: [Dayjs, Dayjs] | null;
    priceMin: number | null;
    priceMax: number | null;
    vin: string | null;
};

const fieldLabelClassName = 'text-[10px] text-[rgb(109,109,109)]';

const rangePickerClassNames = createStaticStyles(({ css }) => ({
    root: css`
            position: relative;
            background-color: transparent;
            border: 1px solid #6a7282;
            border-radius: 4px;
            box-sizing: border-box;
            min-height: 30px;
            align-items: stretch;

            ::after {
                content: '';
                position: absolute;
                inset: -4px;
                border: 2px solid transparent;
                border-radius: 6px;
                pointer-events: none;
                transition: border-color 0.15s;
            }

            :hover,
            :focus-within,
            :focus {
                border-color: #6a7282;
            }

            :focus-within::after,
            :focus::after {
                border-color: rgb(0, 91, 168);
                box-shadow: none;
            }

            input::placeholder {
                color: #9ca3af;
                opacity: 1;
            }

            .ant-picker-range-separator {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        `
}));

type SearchFiltersProps = {
    form: FormInstance<DispatchSearchFilters>;
    onFinish: (values: DispatchSearchFilters) => void;
    onDispatchIdChange: (value: string) => void;
    onReset: () => void;
};

const SearchFilters = ({ form, onFinish, onReset, onDispatchIdChange }: SearchFiltersProps) => {
    return (
        <div className='flex flex-col border-r border-r-gray-400 min-h-full'>
            <Form
                form={form}
                layout='vertical'
                onValuesChange={(changedValues, allValues) => {
                    if ('dispatchId' in changedValues || 'vin' in changedValues) {
                        return;
                    } else {
                        onFinish(allValues);
                    }
                }}
            >
                <div className='px-3 pt-2 border-b border-b-gray-400'>
                    <Collapse
                        classNames={collapseClassNames}
                        items={[{
                            key: '1',
                            label: 'Load',
                            children: (
                                <div className='flex flex-col items-start gap-0.5'>
                                    <label htmlFor='dispatchId' className='text-[10px] text-[rgb(109,109,109)]'>Load ID</label>
                                    <Form.Item name='dispatchId' noStyle>

                                        <Input
                                            id='dispatchId'
                                            allowClear
                                            onClear={onReset}
                                            classNames={inputClassNames}
                                            placeholder='ID Number'
                                            size='small'
                                            suffix={
                                                <SearchOutlined
                                                    style={{ color: '#005ba8', fontSize: 16 }}
                                                    onClick={() => onDispatchIdChange(form.getFieldValue('dispatchId'))}
                                                />}
                                        />
                                    </Form.Item>
                                </div>
                            ),
                        }]}
                    />
                </div>

                <div className='px-3 border-b border-b-gray-400'>
                    <Collapse
                        classNames={collapseClassNames}
                        items={[{
                            key: '1',
                            label: 'Dates',
                            children: (
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-col items-start gap-0.5'>
                                        <label htmlFor='pickupDateRange' className={fieldLabelClassName}>Pickup Date</label>
                                        <Form.Item name='pickupDateRange' noStyle>
                                            <RangePicker id='pickupDateRange' allowClear onClear={onReset} placement='bottomLeft' classNames={rangePickerClassNames} size='small' className='w-full' />
                                        </Form.Item>
                                    </div>
                                    <div className='flex flex-col items-start gap-0.5'>
                                        <label htmlFor='dropoffDateRange' className={fieldLabelClassName}>Drop-off Date</label>
                                        <Form.Item name='dropoffDateRange' noStyle>
                                            <RangePicker id='dropoffDateRange' allowClear onClear={onReset} placement='bottomLeft' classNames={rangePickerClassNames} size='small' className='w-full' />
                                        </Form.Item>
                                    </div>
                                </div>
                            ),
                        }]}
                    />
                </div>

                <div className='px-3 border-b border-b-gray-400'>
                    <Collapse
                        classNames={collapseClassNames}
                        items={[{
                            key: '1',
                            label: 'Status',
                            children: (
                                <Form.Item name='status' noStyle>
                                    <Checkbox.Group options={DISPATCH_STATUS_OPTIONS} className='flex flex-col gap-1' />
                                </Form.Item>
                            ),
                        }]}
                    />
                </div>

                <div className='px-3 border-b border-b-gray-400'>
                    <Collapse
                        classNames={collapseClassNames}
                        items={[{
                            key: '1',
                            label: 'Price',
                            children: (
                                <div className='flex gap-2'>
                                    <div className='flex flex-col items-start gap-0.5 w-full'>
                                        <label htmlFor='priceMin' className={fieldLabelClassName}>Min Price</label>
                                        <Form.Item name='priceMin' noStyle>
                                            <InputNumber id='priceMin' classNames={numberClassNames} size='small' prefix='$' placeholder='Min' className='w-full' controls={false} />
                                        </Form.Item>
                                    </div>
                                    <div className='flex flex-col items-start gap-0.5 w-full'>
                                        <label htmlFor='priceMax' className={fieldLabelClassName}>Max Price</label>
                                        <Form.Item name='priceMax' noStyle>
                                            <InputNumber id='priceMax' classNames={numberClassNames} size='small' prefix='$' placeholder='Max' className='w-full' controls={false} />
                                        </Form.Item>
                                    </div>
                                </div>
                            ),
                        }]}
                    />
                </div>
                <div className='px-3 border-b border-b-gray-400'>
                    <Collapse
                        classNames={collapseClassNames}
                        items={[{
                            key: '1',
                            label: 'Vehicle Vin',
                            children: (
                                <div className='flex flex-col items-start gap-0.5'>
                                    <label htmlFor='vin' className={fieldLabelClassName}>Vehicle VIN</label>
                                    <Form.Item name='vin' noStyle>
                                        <Input
                                            id='vin'
                                            allowClear
                                            onClear={onReset}
                                            classNames={inputClassNames}
                                            size='small'
                                            placeholder='Partial VIN match'
                                            suffix={
                                                <SearchOutlined
                                                    style={{ color: '#005ba8', fontSize: 16 }}
                                                    onClick={() => onFinish(form.getFieldsValue())}
                                                />}
                                        />
                                    </Form.Item>
                                </div>
                            ),
                        }]}
                    />
                </div>
            </Form >
        </div >
    );
};

export default SearchFilters;
