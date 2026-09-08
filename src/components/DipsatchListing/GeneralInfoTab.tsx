import React from 'react';

type GeneralInfoTabProps = {
    pickupLocation: string,
    dropoffLocation: string,
    vehiclesCount: number,
    listingCreatedAt: Date,
    listingUpdatedAt: Date;
};

const GeneralInfoTab = ({ pickupLocation, dropoffLocation, vehiclesCount, listingCreatedAt, listingUpdatedAt }: GeneralInfoTabProps) => {
    return (
        <div className='grid grid-cols-3'>
            <div className='flex flex-col items-start'>
                <div className='text-[14px] text-[rgb(35,114,184)] pb-2 font-medium'>Job Info</div>

                <div className='pb-1.5 flex flex-col items-start'>
                    <div className='text-[12px] text-[rgb(109,109,109)]'>Pick-Up Location</div>
                    <div className='text-[14px] text-[rgb(0,91,168)]'>{pickupLocation}</div>
                </div>

                <div className='pb-1.5 flex flex-col items-start'>
                    <div className='text-[12px] text-[rgb(109,109,109)]'>Dropoff Location</div>
                    <div className='text-[14px] text-[rgb(0,91,168)]'>{dropoffLocation}</div>
                </div>
            </div>
            <div className='flex flex-col items-start'>
                <div className='text-[14px] text-[rgb(35,114,184)] pb-2 font-medium'>Vehicle Info</div>
                <div className='pb-1.5 flex flex-col items-start'>
                    <div className='text-[12px] text-[rgb(109,109,109)]'>Vehicles</div>
                    <div className='text-[14px] text-black'>{vehiclesCount} total</div>
                </div>
            </div>
            <div className='flex flex-col items-start'>
                <div className='text-[14px] text-[rgb(35,114,184)] pb-2 font-medium'>Dates</div>
                <div className='pb-1.5 flex flex-col items-start'>
                    <div className='text-[12px] text-[rgb(109,109,109)]'>Created Date</div>
                    <div className='text-[14px] text-black'>{listingCreatedAt.toLocaleDateString()}</div>
                </div>
                <div className='pb-1.5 flex flex-col items-start'>

                    <div className='text-[12px] text-[rgb(109,109,109)]'>Last Modified Date</div>
                    <div className='text-[14px] text-black'>{listingUpdatedAt.toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    );
};

export default GeneralInfoTab;