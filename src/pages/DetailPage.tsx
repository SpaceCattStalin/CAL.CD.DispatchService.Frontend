import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Empty, Input, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import FormSection from '../components/common/FormSection';
import type { LoadProps } from '../components/Load/Load';
import type { Stop } from '../types/Stop';
import { getSingleDispatch } from '../services/dispatchService';
import { inputClassNames } from '../components/common/inputStyles';

const valueInputClassNames = { ...inputClassNames, input: 'text-[16px] text-black' };
const companyNameInputClassNames = { ...inputClassNames, input: 'text-[18px] text-[#003468] font-bold' };
const readOnlyStyles = { root: { backgroundColor: 'rgba(0,0,0,0.04)' } };

const renderStopFields = (stop: Stop, keyPrefix: string) => [
    { key: `${keyPrefix}-address`, label: 'Address', input: <Input readOnly styles={readOnlyStyles} value={stop.address || '—'} classNames={valueInputClassNames} size='small' /> },
    [
        { key: `${keyPrefix}-locationName`, label: 'Location Name', input: <Input readOnly styles={readOnlyStyles} value={stop.locationName || '—'} classNames={valueInputClassNames} size='small' /> },
        { key: `${keyPrefix}-contactName`, label: 'Contact Name', input: <Input readOnly styles={readOnlyStyles} value={stop.contactName || '—'} classNames={valueInputClassNames} size='small' /> },
    ],
    [
        { key: `${keyPrefix}-contactPhone`, label: 'Contact Phone', input: <Input readOnly styles={readOnlyStyles} value={stop.contactPhone || '—'} classNames={valueInputClassNames} size='small' /> },
        { key: `${keyPrefix}-contactEmail`, label: 'Contact Email', input: <Input readOnly styles={readOnlyStyles} value={stop.contactEmail || '—'} classNames={valueInputClassNames} size='small' /> },
    ],
];

const DetailPage = () => {
    const { dispatchId } = useParams<{ dispatchId: string; }>();
    return <DetailPageContent key={dispatchId} dispatchId={dispatchId} />;
};

const DetailPageContent = ({ dispatchId }: { dispatchId: string | undefined; }) => {
    const navigate = useNavigate();
    const [dispatch, setDispatch] = useState<LoadProps>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getSingleDispatch(dispatchId)
            .then((data) => { if (!cancelled) setDispatch(data); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [dispatchId]);

    if (loading) {
        return <div className='flex items-center justify-center h-full'><Spin size='large' /></div>;
    }

    if (!dispatch) {
        return <div className='flex items-center justify-center h-full'><Empty description='Dispatch not found' /></div>;
    }

    return (
        <div className='flex flex-col gap-4 py-5 px-19'>
            <div className='flex items-center justify-between'>
                <div
                    className='flex items-center gap-1 w-fit text-[18px] text-[rgb(0,91,168)] cursor-pointer'
                    onClick={() => navigate('/')}
                >
                    <LeftOutlined style={{ fontSize: 14 }} />
                    <span>BACK TO DISPATCHES</span>
                </div>
                <Button type='primary' onClick={() => navigate(`/dispatch/${dispatchId}/edit`)}>
                    Edit
                </Button>
            </div>
            <h1 className='text-[28px] text-black font-bold'>Load Detail</h1>
            <div className='grid grid-cols-2 gap-3'>
                <FormSection
                    sectionName='Carrier'
                    fields={[
                        { key: 'companyName', label: 'Company Name', input: <Input readOnly value={dispatch.carrierInfo.carrierCompanyName} styles={{ root: { backgroundColor: 'rgba(0,0,0,0.04)' } }} classNames={companyNameInputClassNames} size='small' /> },
                        { key: 'companyPhone', label: 'Phone', input: <Input readOnly value={dispatch.carrierInfo.carrierCompanyPhone} styles={{ root: { backgroundColor: 'rgba(0,0,0,0.04)' } }} classNames={valueInputClassNames} size='small' /> },
                        { key: 'companyEmail', label: 'Email', input: <Input readOnly value={dispatch.carrierInfo.carrierCompanyEmail} styles={{ root: { backgroundColor: 'rgba(0,0,0,0.04)' } }} classNames={valueInputClassNames} size='small' /> },
                    ]}
                />
                <FormSection
                    sectionName='Pick Up and Delivery Date'
                    fields={[
                        [
                            { key: 'pickupDate', label: 'Pickup Date', input: <Input readOnly styles={{ root: { backgroundColor: 'rgba(0,0,0,0.04)' } }} value={dispatch.pickupDate.toLocaleDateString()} classNames={valueInputClassNames} size='small' /> },
                            { key: 'dropoffDate', label: 'Dropoff Date', input: <Input readOnly styles={{ root: { backgroundColor: 'rgba(0,0,0,0.04)' } }} value={dispatch.dropoffDate.toLocaleDateString()} classNames={valueInputClassNames} size='small' /> },
                        ],
                    ]}
                />
            </div>


            <div className='grid grid-cols-2 gap-3'>
                <FormSection sectionName='Pick-Up Location' fields={renderStopFields(dispatch.pickupStop, 'pickup')} />
                <FormSection sectionName='Delivery Location' fields={renderStopFields(dispatch.dropoffStop, 'dropoff')} />
            </div>

            <FormSection
                sectionName='Pricing and Payment'
                fields={[
                    { key: 'price', label: 'Price', input: <Input readOnly styles={{ root: { backgroundColor: 'rgba(0,0,0,0.04)' } }} value={`$${dispatch.price}`} classNames={valueInputClassNames} size='small' /> },
                    { key: 'description', label: 'Description', input: <Input.TextArea readOnly autoSize={{ minRows: 2 }} value={dispatch.description || '—'} classNames={{ root: valueInputClassNames.root }} /> },
                ]}
            />
            <FormSection
                sectionName='Vehicle Information'
                fields={
                    dispatch.vehicleInfo.length > 0
                        ? dispatch.vehicleInfo.map((vehicle, index) => ({
                            key: `vehicle-${index}`,
                            label: `Vehicle ${index + 1}`,
                            input: <Input readOnly styles={{ root: { backgroundColor: 'rgba(0,0,0,0.04)', marginBottom: 12 } }} value={`${vehicle.year} ${vehicle.make} ${vehicle.model} · ${vehicle.color} · VIN ${vehicle.vin}`} classNames={valueInputClassNames} size='small' />,
                        }))
                        : [{ key: 'no-vehicles', label: 'Vehicles', input: <Input readOnly value='No vehicles' classNames={valueInputClassNames} size='small' /> }]
                }
            />
        </div>
    );
};

export default DetailPage;
