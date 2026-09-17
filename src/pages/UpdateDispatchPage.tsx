import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Empty, message } from 'antd';
import DispatchForm from '../components/common/DispatchForm';
import type { DispatchFormValues } from '../components/common/DispatchForm';
import type { LoadProps } from '../components/Load/Load';
import { getSingleDispatch, updateDispatch, toUpdateDispatchRequest, toDispatchFormValues } from '../services/dispatchService';
import { LeftOutlined } from '@ant-design/icons';

const UpdateDispatchPage = () => {
    const { dispatchId : localDispatchId } = useParams<{ dispatchId: string; }>();
    const parsedDispatchId = localDispatchId ?? null;
    
    return <UpdateDispatchPageContent key={parsedDispatchId} dispatchId={parsedDispatchId} />;
};

const UpdateDispatchPageContent = ({ dispatchId }: { dispatchId: string | null; }) => {
    const navigate = useNavigate();
    const [dispatch, setDispatch] = useState<LoadProps>();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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

    const handleFinish = async (values: DispatchFormValues) => {
        setSubmitting(true);
        try {
            const { location } = await updateDispatch(dispatch.dispatchId, toUpdateDispatchRequest(values));
            navigate(location);
        } catch {
            message.error('Failed to update dispatch');
        } finally {
            setSubmitting(false);
        }
    };

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
            </div>
            <h1 className='text-[28px] text-black font-bold'>Edit Dispatch</h1>
            <DispatchForm
                mode='update'
                initialValues={toDispatchFormValues(dispatch)}
                carrierInfo={dispatch.carrierInfo}
                statusDisplay={dispatch.dispatchStatus}
                submitting={submitting}
                onFinish={handleFinish}
            />
        </div>
    );
};

export default UpdateDispatchPage;