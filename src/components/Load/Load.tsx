import React from 'react';
import type { StatusBadgeProps } from '../DipsatchListing/StatusBadge';
import type { Vehicle } from '../../types/Vehicle';
import StatusBadge from '../DipsatchListing/StatusBadge';
import { Button } from 'antd';
import { createStaticStyles } from 'antd-style';

export type LoadProps = {
    dispatchId: string,
    pickupLocation: string,
    dispatchStatus: StatusBadgeProps['status'],
    pickupDate: Date,
    carrierInfo: Company,
    driverInfo: Driver,
    dropoffLocation: string,
    dropoffDate: Date,
    vehicleInfo: Vehicle[],
    listingCreatedAt: Date,
    listingUpdatedAt: Date,
    price: number;
};

type Company = {
    companyId: string,
    type: string,
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


const Load = ({ load }: { load: LoadProps; }) => {
    return (
        <div className='rounded-sm flex flex-col border border-gray-500'>
            <div>

            </div>
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
                    <div className='flex flex-col'>
                        <div className='text-[12px] text-[rgb(109,109,109)]'>Carrier Info</div>
                        <span className='text-[18px] text-[rgb(0,91,168)]'>{load.carrierInfo.companyName}</span>
                        <span className='text-[14px] text-black'>{load.carrierInfo.companyEmail}</span>
                        <span className='text-[14px] text-black'>{load.carrierInfo.companyPhone}</span>
                    </div>
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
                                    {load.vehicleInfo.map((vehicle, key) => (
                                        <li key={key}>
                                            {vehicle.year} {vehicle.make} {vehicle.model}
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                        <div className='text-[#003468] font-bold'>
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
                    <Button type='primary' classNames={buttonClassNames}>Assign</Button>
                </div>
            </div>
        </div>
    );
};

export default Load;