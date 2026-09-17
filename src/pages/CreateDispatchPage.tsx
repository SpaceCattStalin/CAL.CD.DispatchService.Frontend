import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import DispatchForm from '../components/common/DispatchForm';
import type { DispatchFormValues } from '../components/common/DispatchForm';
import { createDispatch, toCreateDispatchRequest } from '../services/dispatchService';

const CreateDispatchPage = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const handleFinish = async (values: DispatchFormValues) => {
        setSubmitting(true);
        try {
            const { location } = await createDispatch(toCreateDispatchRequest(values));
            navigate(location);
        } catch {
            message.error('Failed to create dispatch');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='flex flex-col gap-4 py-5 px-19'>
            <h1 className='text-[28px] text-black font-bold'>Create Dispatch</h1>
            <DispatchForm mode='create' submitting={submitting} onFinish={handleFinish} />
        </div>
    );
};

export default CreateDispatchPage;