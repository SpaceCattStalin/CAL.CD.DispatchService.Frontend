import { Form, Input, DatePicker, InputNumber, Collapse, Checkbox } from 'antd';
import type { FormInstance } from 'antd';
import { createStaticStyles } from 'antd-style';
import { SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

// Mirrors Domain.DispatchStatus (backend), serialized as strings via JsonStringEnumConverter.
export type DispatchStatus = 'NotSigned' | 'PendingPickup' | 'PendingDelivery' | 'Delivered' | 'Canceled';

const DISPATCH_STATUS_OPTIONS: { label: string; value: DispatchStatus; }[] = [
    { label: 'Not Signed', value: 'NotSigned' },
    { label: 'Pending Pickup', value: 'PendingPickup' },
    { label: 'Pending Delivery', value: 'PendingDelivery' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Canceled', value: 'Canceled' },
];

export type DispatchSearchFilters = {
    dispatchId?: string;
    status?: DispatchStatus[];
    pickupDateRange?: [Dayjs, Dayjs];
    dropoffDateRange?: [Dayjs, Dayjs];
    priceMin?: number;
    priceMax?: number;
    vin?: string;
};

export type SearchFiltersProps = {
    form: FormInstance<DispatchSearchFilters>;
    onFinish: (values: DispatchSearchFilters) => void;
    onReset: () => void;
};

const SearchFilters = ({ form, onFinish }: SearchFiltersProps) => {
    const collapseClassNames = createStaticStyles(({ css }) => ({
        root: css`
            background-color: transparent;
            border: 0;
            border-radius: 0;
            padding-top: 8px;
            padding-bottom: 12px;
            .ant-collapse-panel {
                border-top: 0;
            }
        `,
        header: css`
            padding: 6px 20px !important;
            
            border-radius: 0 !important;

            :hover{
                background-color: #EBF6FF;
            }
        `,
        title: css`
            color: rgb(0, 91, 168);
            padding: 0 !important;
            font-weight: 500;
            text-align: left;
        `,
        icon: css`
            padding: 0 !important;
            color: rgb(0, 91, 168);
        `,
        body: css`
            padding: 4px 0 0px 20px !important;
        `
    }));

    const inputClassNames = createStaticStyles(({ css }) => ({
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
        `,
        suffix: css`
            display: flex;
            align-items: center;

            > *:last-child {
                border-left: 0.5px solid #6a7282;
                padding-left: 8px;
                margin-left: 4px;
                align-self: stretch;
                cursor: pointer;
            }
        `
    }));

    const fieldLabelClassName = 'text-[10px] text-[rgb(109,109,109)]';

    const numberClassNames = createStaticStyles(({ css }) => ({
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
        `,
        prefix: css`
            color: #6a7282;
            margin-right: 4px;
        `
    }));

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


    // const buttonClassNames = createStaticStyles(({ css }) => ({
    //     root: css`
    //         background-color: rgb(0, 91, 168);
    //         :hover {
    //             background-color: #2372B8 !important;
    //             transition: all;
    //         }
    //     `
    // }));

    return (
        <div className='flex flex-col border-r border-r-gray-400 h-full'>
            <Form form={form} layout='vertical' onFinish={onFinish}>
                <div className='px-3 pt-2 border-b border-b-gray-400'>
                    <Collapse
                        classNames={collapseClassNames}
                        items={[{
                            key: '1',
                            label: 'Listing',
                            children: (
                                <Form.Item name='dispatchId' noStyle>
                                    <div className='flex flex-col items-start gap-0.5'>
                                        <label htmlFor='dispatchId' className='text-[10px] text-[rgb(109,109,109)]'>Listing ID</label>
                                        <Input
                                            id='dispatchId'
                                            allowClear
                                            classNames={inputClassNames}
                                            placeholder='ID Number'
                                            size='small'
                                            suffix={
                                                <SearchOutlined
                                                    style={{ color: '#005ba8', fontSize: 16 }}
                                                />}
                                        />
                                    </div>
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
                            label: 'Dates',
                            children: (
                                <div className='flex flex-col gap-2'>
                                    <Form.Item name='pickupDateRange' noStyle>
                                        <div className='flex flex-col items-start gap-0.5'>
                                            <label htmlFor='pickupDateRange' className={fieldLabelClassName}>Pickup Date</label>
                                            <RangePicker id='pickupDateRange' classNames={rangePickerClassNames} size='small' className='w-full' />
                                        </div>
                                    </Form.Item>
                                    <Form.Item name='dropoffDateRange' noStyle>
                                        <div className='flex flex-col items-start gap-0.5'>
                                            <label htmlFor='dropoffDateRange' className={fieldLabelClassName}>Drop-off Date</label>
                                            <RangePicker id='dropoffDateRange' classNames={rangePickerClassNames} size='small' className='w-full' />
                                        </div>
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
                            label: 'Price',
                            children: (
                                <div className='flex gap-2'>
                                    <Form.Item name='priceMin' noStyle>
                                        <div className='flex flex-col items-start gap-0.5 w-full'>
                                            <label htmlFor='priceMin' className={fieldLabelClassName}>Min Price</label>
                                            <InputNumber id='priceMin' classNames={numberClassNames} size='small' prefix='$' placeholder='Min' className='w-full' />
                                        </div>
                                    </Form.Item>
                                    <Form.Item name='priceMax' noStyle>
                                        <div className='flex flex-col items-start gap-0.5 w-full'>
                                            <label htmlFor='priceMax' className={fieldLabelClassName}>Max Price</label>
                                            <InputNumber id='priceMax' classNames={numberClassNames} size='small' prefix='$' placeholder='Max' className='w-full' />
                                        </div>
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
                            label: 'Vehicle Vin',
                            children: (
                                <Form.Item name='vin' noStyle>
                                    <div className='flex flex-col items-start gap-0.5'>
                                        <label htmlFor='vin' className={fieldLabelClassName}>Vehicle VIN</label>
                                        <Input
                                            id='vin'
                                            allowClear
                                            classNames={inputClassNames}
                                            size='small'
                                            placeholder='Partial VIN match'
                                            suffix={
                                                <SearchOutlined
                                                    style={{ color: '#005ba8', fontSize: 16 }}
                                                />}
                                        />
                                    </div>
                                </Form.Item>
                            ),
                        }]}
                    />
                </div>

                {/* <div className='flex justify-end gap-2 px-3 pt-3'>
                    <Button onClick={onReset}>Reset</Button>
                    <Button type='primary' htmlType='submit' classNames={buttonClassNames}>Search</Button>
                </div> */}
            </Form>
        </div>
    );
};

export default SearchFilters;
