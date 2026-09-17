import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, DatePicker, Select, Collapse, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import FormSection from './FormSection';
import StatusBadge from './StatusBadge';
import { inputClassNames, numberClassNames, datePickerClassNames, selectClassNames, collapseClassNames } from './inputStyles';
import { getCarriers, type CarrierOption } from '../../services/carrierService';
import type { Company } from '../Load/Load';
import type { Stop } from '../../types/Stop';
import type { DispatchStatus } from '../../types/Dispatch';

const fieldLabelClassName = 'text-[10px] text-[rgb(109,109,109)]';
const readOnlyStyles = { root: { backgroundColor: 'rgba(0,0,0,0.04)' } };
const readOnlyClassNames = { ...inputClassNames, input: 'text-[16px] text-black' };

const VEHICLE_YEAR_OPTIONS = Array.from({ length: 2026 - 1900 + 1 }, (_, index) => {
    const year = 2026 - index;
    return { value: year, label: String(year) };
});

export type VehicleFormValue = {
    vehicleId: string;
    vin?: string;
    year?: number;
    make: string;
    model: string;
    color?: string;
};

export type DispatchFormValues = {
    carrierId?: string;
    price: number;
    pickupDate: Dayjs;
    dropoffDate: Dayjs;
    description?: string;
    pickupStop: Stop;
    dropoffStop: Stop;
    vehicles: VehicleFormValue[];
};

export type DispatchFormProps = {
    mode: 'create' | 'update';
    initialValues?: Partial<DispatchFormValues>;
    carrierInfo?: Company;
    statusDisplay?: DispatchStatus;
    submitting?: boolean;
    onFinish: (values: DispatchFormValues) => void | Promise<void>;
};

const renderStopFields = (stopName: 'pickupStop' | 'dropoffStop') => [
    {
        key: `${stopName}-address`, label: 'Address', input: (
            <Form.Item name={[stopName, 'address']} rules={[{ required: true, message: 'Address is required' }]} noStyle>
                <Input classNames={inputClassNames}
                    size='small'
                    placeholder='Address'
                    suffix={<></>}
                />
            </Form.Item>
        )
    },
    [
        {
            key: `${stopName}-locationName`, label: 'Location Name', input: (
                <Form.Item name={[stopName, 'locationName']} noStyle>
                    <Input classNames={inputClassNames} size='small' placeholder='Location Name' suffix={<></>} />
                </Form.Item>
            )
        },
        {
            key: `${stopName}-contactName`, label: 'Contact Name', input: (
                <Form.Item name={[stopName, 'contactName']} noStyle>
                    <Input classNames={inputClassNames} size='small' placeholder='Contact Name' suffix={<></>} />
                </Form.Item>
            )
        },
    ],
    [
        {
            key: `${stopName}-contactPhone`, label: 'Contact Phone', input: (
                <Form.Item name={[stopName, 'contactPhone']} noStyle>
                    <Input classNames={inputClassNames} size='small' placeholder='Contact Phone' suffix={<></>} />
                </Form.Item>
            )
        },
        {
            key: `${stopName}-contactEmail`, label: 'Contact Email', input: (
                <Form.Item name={[stopName, 'contactEmail']} noStyle>
                    <Input classNames={inputClassNames} size='small' placeholder='Contact Email' suffix={<></>} />
                </Form.Item>
            )
        },
    ],
];

const DispatchForm = ({ mode, initialValues, carrierInfo, statusDisplay, submitting, onFinish }: DispatchFormProps) => {
    const navigate = useNavigate();
    const [form] = Form.useForm<DispatchFormValues>();
    const [carrierOptions, setCarrierOptions] = useState<CarrierOption[]>([]);
    const [carriersLoading, setCarriersLoading] = useState(mode === 'create');
    const [collapsedKeys, setCollapsedKeys] = useState<string[]>([]);

    useEffect(() => {
        if (mode !== 'create') return;
        let cancelled = false;
        getCarriers()
            .then((options) => { if (!cancelled) setCarrierOptions(options); })
            .catch(() => { if (!cancelled) setCarrierOptions([]); })
            .finally(() => { if (!cancelled) setCarriersLoading(false); });
        return () => { cancelled = true; };
    }, [mode]);

    return (
        <Form
            form={form}
            layout='vertical'
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={({ errorFields }) => console.log('Form validation failed', errorFields)}
            className='flex flex-col gap-4'
        >
            <FormSection
                sectionName='Carrier'
                fields={
                    mode === 'create'
                        ? [
                            {
                                key: 'carrierId', label: 'Carrier', input: (
                                    <Form.Item name='carrierId' rules={[{ required: true, message: 'Carrier is required' }]} noStyle>
                                        <Select
                                            classNames={selectClassNames}
                                            size='small'
                                            showSearch={{ optionFilterProp: 'label' }}
                                            loading={carriersLoading}
                                            options={carrierOptions}
                                            placeholder='Select a carrier'
                                            notFoundContent={carriersLoading ? 'Loading…' : 'No carriers available yet'}
                                        />
                                    </Form.Item>
                                )
                            },
                        ]
                        : [
                            { key: 'companyName', label: 'Company Name', input: <Input readOnly value={carrierInfo?.carrierCompanyName} styles={readOnlyStyles} classNames={readOnlyClassNames} size='small' /> },
                            { key: 'companyPhone', label: 'Phone', input: <Input readOnly value={carrierInfo?.carrierCompanyPhone} styles={readOnlyStyles} classNames={readOnlyClassNames} size='small' /> },
                            { key: 'companyEmail', label: 'Email', input: <Input readOnly value={carrierInfo?.carrierCompanyEmail} styles={readOnlyStyles} classNames={readOnlyClassNames} size='small' /> },
                        ]
                }
            />

            {mode === 'update' && (
                <FormSection
                    sectionName='Status'
                    fields={[
                        {
                            key: 'status', label: 'Status', input: (
                                <div className='flex items-center h-7.5'>
                                    {statusDisplay && <StatusBadge status={statusDisplay} />}
                                </div>
                            )
                        },
                    ]}
                />
            )}

            <FormSection sectionName='Pick-Up Location' fields={renderStopFields('pickupStop')} />
            <FormSection sectionName='Delivery Location' fields={renderStopFields('dropoffStop')} />

            <div className='grid grid-cols-3 gap-2'>
                <div className='col-span-1'>

                    <FormSection
                        sectionName='Pricing and Dates'
                        fields={[
                            {
                                key: 'price', label: 'Price', input: (
                                    <Form.Item name='price' rules={[{ required: true, message: 'Price is required' }]} noStyle>
                                        <InputNumber classNames={numberClassNames} size='small' prefix='$' controls={false} className='w-full' placeholder='0' />
                                    </Form.Item>
                                )
                            },
                            [
                                {
                                    key: 'pickupDate', label: 'Pickup Date', input: (
                                        <Form.Item name='pickupDate' rules={[{ required: true, message: 'Pickup date is required' }]} noStyle>
                                            <DatePicker classNames={datePickerClassNames} size='small' className='w-full' />
                                        </Form.Item>
                                    )
                                },
                                {
                                    key: 'dropoffDate', label: 'Dropoff Date', input: (
                                        <Form.Item name='dropoffDate' rules={[{ required: true, message: 'Dropoff date is required' }]} noStyle>
                                            <DatePicker classNames={datePickerClassNames} size='small' className='w-full' />
                                        </Form.Item>
                                    )
                                },
                            ],
                        ]}
                    />
                </div>
                <div className='col-span-2'>
                    <FormSection
                        sectionName='Description'
                        fields={[
                            {
                                key: 'description', label: 'Description', input: (
                                    <Form.Item name='description' noStyle>
                                        <Input.TextArea classNames={{ root: inputClassNames.root }} autoSize={{ minRows: 2 }} placeholder='Description' allowClear />
                                    </Form.Item>
                                )
                            },
                        ]}
                    />
                </div>
            </div>

            <FormSection
                sectionName='Vehicle Information'
                fields={[
                    {
                        key: 'vehicles', label: '', input: (
                            <Form.List name='vehicles'>
                                {(fields, { add, remove }) => {
                                    const allKeys = fields.map((field) => String(field.key));
                                    const activeKeys = allKeys.filter((key) => !collapsedKeys.includes(key));

                                    return (
                                        <div className='flex flex-col gap-2 w-full'>
                                            <Collapse
                                                classNames={collapseClassNames}
                                                activeKey={activeKeys}
                                                onChange={(openKeys) => {
                                                    const openSet = Array.isArray(openKeys) ? openKeys : [openKeys];
                                                    setCollapsedKeys(allKeys.filter((key) => !openSet.includes(key)));
                                                }}
                                                items={fields.map((field, index) => ({
                                                    key: String(field.key),
                                                    label: `Vehicle ${index + 1}`,
                                                    extra: (
                                                        <DeleteOutlined
                                                            style={{ color: '#005ba8' }}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                remove(field.name);
                                                            }}
                                                        />
                                                    ),
                                                    children: (
                                                        <div className='flex flex-col gap-2 pb-5'>
                                                            <Form.Item name={[field.name, 'vehicleId']} hidden>
                                                                <Input suffix={<></>} />
                                                            </Form.Item>
                                                            <div className='grid grid-cols-2 gap-3'>
                                                                <div className='flex flex-col items-start gap-0.5 w-full'>
                                                                    <label className={fieldLabelClassName}>VIN</label>
                                                                    <Form.Item name={[field.name, 'vin']} noStyle>
                                                                        <Input classNames={inputClassNames} size='small' placeholder='VIN' suffix={<></>} />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className='flex flex-col items-start gap-0.5 w-full'>
                                                                    <label className={fieldLabelClassName}>Year</label>
                                                                    <Form.Item name={[field.name, 'year']} rules={[{ required: true, message: 'Year is required' }]} noStyle>
                                                                        <Select classNames={selectClassNames} size='small' showSearch={{ optionFilterProp: 'label' }} options={VEHICLE_YEAR_OPTIONS} placeholder='Year' />
                                                                    </Form.Item>
                                                                </div>
                                                            </div>
                                                            <div className='grid grid-cols-2 gap-3'>
                                                                <div className='flex flex-col items-start gap-0.5 w-full'>
                                                                    <label className={fieldLabelClassName}>Make</label>
                                                                    <Form.Item name={[field.name, 'make']} rules={[{ required: true, message: 'Make is required' }]} noStyle>
                                                                        <Input classNames={inputClassNames} size='small' placeholder='Make' suffix={<></>} />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className='flex flex-col items-start gap-0.5 w-full'>
                                                                    <label className={fieldLabelClassName}>Model</label>
                                                                    <Form.Item name={[field.name, 'model']} rules={[{ required: true, message: 'Model is required' }]} noStyle>
                                                                        <Input classNames={inputClassNames} size='small' placeholder='Model' suffix={<></>} />
                                                                    </Form.Item>
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col items-start gap-0.5 w-full'>
                                                                <label className={fieldLabelClassName}>Color</label>
                                                                <Form.Item name={[field.name, 'color']} noStyle>
                                                                    <Input classNames={inputClassNames} size='small' placeholder='Color' suffix={<></>} />
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                    ),
                                                }))}
                                            />
                                            <Button
                                                type='dashed'
                                                icon={<PlusOutlined />}
                                                className='w-fit'
                                                onClick={() => add({ vehicleId: crypto.randomUUID(), vin: null, year: null, make: '', model: '', color: null })}
                                            >
                                                Add Vehicle
                                            </Button>
                                            {fields.length === 0 && (
                                                <div className='text-[12px] text-[rgb(109,109,109)]'>No vehicles added yet.</div>
                                            )}
                                        </div>
                                    );
                                }}
                            </Form.List>
                        )
                    },
                ]}
            />

            <div className='flex justify-end gap-2'>
                <Button onClick={() => navigate('/')}>Cancel</Button>
                <Button type='primary' htmlType='submit' loading={submitting}>
                    {mode === 'create' ? 'Create Dispatch' : 'Save Changes'}
                </Button>
            </div>
        </Form>
    );
};

export default DispatchForm;