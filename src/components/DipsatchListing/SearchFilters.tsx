import { Form, Input, DatePicker, InputNumber, Button, Space } from 'antd';
import type { FormInstance } from 'antd';
import { createStaticStyles } from 'antd-style';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

export type DispatchSearchFilters = {
    dispatchId?: string;
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

const SearchFilters = ({ form, onFinish, onReset }: SearchFiltersProps) => {
    const buttonClassNames = createStaticStyles(({ css }) => ({
        root: css`
            background-color: rgb(0, 91, 168);

            :hover {
                background-color: #2372B8 !important;
                transition: all;
            }
        `,
        content: css`
            color:#fff;
        `
    }));

    return (
        <div className='rounded-sm border border-gray-500 bg-white p-3'>
            <Form form={form} layout='vertical' onFinish={onFinish}>
                <div className='grid grid-cols-[repeat(5,minmax(0,1fr))] gap-2.5'>
                    <Form.Item label='Listing ID' name='dispatchId'>
                        <Input allowClear placeholder='Exact listing ID' />
                    </Form.Item>

                    <Form.Item label='Pick-Up Date Range' name='pickupDateRange'>
                        <RangePicker className='w-full' />
                    </Form.Item>

                    <Form.Item label='Dropoff Date Range' name='dropoffDateRange'>
                        <RangePicker className='w-full' />
                    </Form.Item>

                    <Form.Item label='Price Range'>
                        <Space.Compact>
                            <Form.Item name='priceMin' noStyle>
                                <InputNumber prefix='$' placeholder='Min' className='w-full' />
                            </Form.Item>
                            <Form.Item name='priceMax' noStyle>
                                <InputNumber prefix='$' placeholder='Max' className='w-full' />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>

                    <Form.Item label='VIN' name='vin'>
                        <Input allowClear placeholder='Partial VIN match' />
                    </Form.Item>
                </div>

                <div className='flex justify-end gap-2 pt-2'>
                    <Button onClick={onReset}>Reset</Button>
                    <Button type='primary' htmlType='submit' classNames={buttonClassNames}>Search</Button>
                </div>
            </Form>
        </div>
    );
};

export default SearchFilters;
