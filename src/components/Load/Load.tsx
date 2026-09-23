import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { StatusBadgeProps } from '../common/StatusBadge';
import type { Vehicle } from '../../types/Vehicle';
import type { Stop } from '../../types/Stop';
import StatusBadge from '../common/StatusBadge';
import { Button } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { primaryButtonClassNames } from '../common/inputStyles';
import { secondaryButtonClassNames } from './secondaryButtonClassNames';

export type LoadProps = {
    dispatchId: string,
    pickupLocation: string,
    pickupStop: Stop,
    dispatchStatus: StatusBadgeProps['status'],
    pickupDate: Date,
    carrierInfo: Company,
    shipperInfo: Company,
    driverInfo: Driver,
    dropoffLocation: string,
    dropoffStop: Stop,
    dropoffDate: Date,
    vehicleInfo: Vehicle[],
    description?: string,
    listingCreatedAt: Date,
    listingUpdatedAt: Date,
    price: number;
};

export type Company = {
    companyName: string,
    companyPhone: string,
    companyEmail: string;
};

type Driver = {
    userId: string,
    fullName: string,
    phone: string,
    email: string;
};


const Load = ({ load, onModalOpen }: { load: LoadProps; onModalOpen: (load: LoadProps) => void; }) => {
    const navigate = useNavigate();
    const { payload } = useAuth();

    return (
        <div className='rounded-sm flex flex-col border border-gray-500 overflow-clip'>
            <div className='flex gap-2 items-center p-2'>
                <div className='text-[#003468] font-bold text-[18px]'>
                    {load.dispatchId}
                </div>
                <div>
                    <StatusBadge status={load.dispatchStatus} />
                </div>
                <div className='flex items-center gap-2'>
                    <div className='text-[12px] text-[rgb(109,109,109)]'>Dropoff Date</div>
                    <div className='text-[14px] text-black font-bold'>{load.dropoffDate.toLocaleDateString()}</div>
                </div>
            </div>
            <div className='grid grid-cols-4 p-2'>
                <div className='flex flex-col'>
                    <div className='text-[#003468] font-bold'>
                        Dispatch Info
                    </div>
                    <div>
                        <div className='text-[12px] text-[rgb(109,109,109)]'>Dispatch Date</div>
                        <div className='text-[18px] text-black'>{load.pickupDate.toLocaleDateString()}</div>
                    </div>
                    {payload?.company_type === 'Shipper' && <div className='flex flex-col'>
                        <div className='text-[12px] text-[rgb(109,109,109)]'>Carrier Info</div>
                        <span className='text-[18px] text-[rgb(0,91,168)]'>{load.carrierInfo.companyName}</span>
                        <span className='text-[14px] text-black'>{load.carrierInfo.companyEmail}</span>
                        <span className='text-[14px] text-black'>{load.carrierInfo.companyPhone}</span>
                    </div>}
                    {payload?.company_type === 'Carrier' && <div className='flex flex-col'>
                        <div className='text-[12px] text-[rgb(109,109,109)]'>Shipper Info</div>
                        <span className='text-[18px] text-[rgb(0,91,168)]'>{load.shipperInfo.companyName}</span>
                        <span className='text-[14px] text-black'>{load.shipperInfo.companyEmail}</span>
                        <span className='text-[14px] text-black'>{load.shipperInfo.companyPhone}</span>
                    </div>}
                </div>
                <div className='flex flex-col'>
                    <div className='text-[#003468] font-bold'>
                        Load Info
                    </div>
                    <div>
                        <div className='text-[18px] text-black'>${load.price}</div>
                        <div className='text-[12px] text-[rgb(109,109,109)]'>Vehicle Info ({load.vehicleInfo.length})</div>
                        <div>
                            {load.vehicleInfo.length > 0 &&
                                <ul className='flex flex-col items-start'>
                                    {load.vehicleInfo.map((vehicle, index) => {
                                        if (index < 4) {
                                            return (
                                                <li key={index}>
                                                    {vehicle.vin.substring(0, 6)} {vehicle.year} {vehicle.make} {vehicle.model}
                                                </li>
                                            );
                                        }
                                        if (index === 4) {
                                            return <li className='text-[#003468] font-bold' key={index}>+{load.vehicleInfo.length - 4} more</li>;
                                        }
                                        return null;
                                    })}
                                </ul>
                            }
                        </div>
                        <div className='text-[#003468] font-bold cursor-pointer'
                            onClick={() => navigate(`/dispatch/${load.dispatchId}`)}>
                            View all details
                        </div>
                    </div>
                    <div>
                        <div className='text-[12px] text-[rgb(109,109,109)]'>Driver Info</div>
                        <div className='text-[18px] text-black'>{load.driverInfo.fullName}</div>
                        <div className='text-[12px] text-black'>{load.driverInfo.email}</div>
                        <div className='text-[12px] text-black'>{load.driverInfo.phone}</div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[#003468] font-bold'>
                        Origin
                    </div>
                    <div className='text-[18px] text-black'>{load.pickupLocation}</div>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[#003468] font-bold'>
                        Destination
                    </div>
                    <div className='text-[18px] text-black'>{load.dropoffLocation}</div>
                </div>
            </div>
            <div className='flex items-center justify-end bg-gray-200 py-2 px-4'>
                <div className='flex gap-1'>
                    <Button
                        type='default'
                        classNames={secondaryButtonClassNames}
                        onClick={() => navigate(`/dispatch/${load.dispatchId}`)}
                    >
                        Detail
                    </Button>
                    {payload?.company_type === "Shipper" &&
                        <Button
                            type='primary'
                            classNames={primaryButtonClassNames}
                            onClick={() => navigate(`/dispatch/${load.dispatchId}/edit`)}
                        >
                            Edit
                        </Button>}
                    {(payload?.company_type === "Carrier" && load.dispatchStatus === 'NotSigned') &&
                        <Button
                            type='primary'
                            classNames={primaryButtonClassNames}
                            onClick={() => onModalOpen(load)}
                        >
                            Accept
                        </Button>}

                    {(payload?.company_type === "Carrier" && (load.dispatchStatus === 'PendingPickup' || load.dispatchStatus === 'PendingDelivery')) &&
                        <Button
                            type='primary'
                            classNames={primaryButtonClassNames}
                            onClick={() => onModalOpen(load)}
                        >
                            Update Status
                        </Button>}
                    {/* <Button
                        type='default'
                        classNames={secondaryButtonClassNames}
                        onClick={() => navigate(`/dispatch/${load.dispatchId}/edit`)}
                    >
                        Edit
                    </Button> */}
                    {/* <Button type='primary' classNames={buttonClassNames}>Assign</Button> */}
                </div>
            </div>
        </div >
    );
};

export default Load;