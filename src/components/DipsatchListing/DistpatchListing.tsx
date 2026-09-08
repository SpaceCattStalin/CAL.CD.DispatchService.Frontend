import { useState } from 'react';
import { Tabs, Button } from 'antd';
import type { TabsProps } from 'antd';
import { createStaticStyles } from 'antd-style';
import StatusBadge from './StatusBadge';
import type { StatusBadgeProps } from './StatusBadge';
import GeneralInfoTab from './GeneralInfoTab';
import VehicleInfoTab from './VehicleInfoTab';
import type { Vehicle } from '../../types/Vehicle';

export type DispatchListingProps = {
    dispatchId: string,
    pickupLocation: string,
    dispatchStatus: StatusBadgeProps['status'],
    pickupDate: Date,
    dropoffLocation: string,
    dropoffDate: Date,
    vehicleInfo: Vehicle[],
    listingCreatedAt: Date,
    listingUpdatedAt: Date,
    price: number;
};

const DistpatchListing = ({ listing }: { listing: DispatchListingProps; }) => {
    const [expanded, setExpanded] = useState(false);

    const tabClassNames = createStaticStyles(({ css }) => ({
        item: css`
            :hover {
                background-color: #DFE9F2;
                transition: all;
            };
            &.ant-tabs-tab-active p{
                color: #000;
            };
            :not(:first-child){
                position: relative;
                right: 30px;
            }     
        `
    }));

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

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <p className='text-md'>General Info</p>,
            children: <GeneralInfoTab
                pickupLocation={listing.pickupLocation}
                dropoffLocation={listing.dropoffLocation}
                listingCreatedAt={listing.listingCreatedAt}
                listingUpdatedAt={listing.listingUpdatedAt}
                vehiclesCount={listing.vehicleInfo.length}
            />,
        },
        {
            key: '2',
            label: <p className='text-md'>Vehicle Info ({listing.vehicleInfo.length})</p>,

            children: <VehicleInfoTab vehicles={listing.vehicleInfo} />,
        }
    ];

    const stylesObject: TabsProps['styles'] = {
        root: { borderStyle: 'none', padding: 0, marginBottom: 4 },
        header: { backgroundColor: '#fff', borderBottom: '1px solid #d9d9d9' },
        item: { fontWeight: 500, color: '#005AAF', padding: `10px 10px 12px 10px`, borderRadius: 0 },
        indicator: { backgroundColor: '#003468', height: 4 },
        body: { backgroundColor: '#fff' },
    };

    const tabProps: TabsProps = {
        items: listing.vehicleInfo.length > 1 ? items : items.slice(0, -1),
        defaultActiveKey: '1',
        classNames: tabClassNames,
    };

    return (
        <div className='rounded-sm flex flex-col border border-gray-500'>
            <div className='pt-1 px-2 pb-2'>
                <div className='flex'>
                    <StatusBadge status={listing.dispatchStatus} />
                </div>
                <div
                    className='grid grid-cols-[repeat(4,minmax(0,1fr))_auto] gap-2.5 px-2 cursor-pointer pt-1.5'
                    role='button'
                    tabIndex={0}
                    onClick={() => {
                        setExpanded((prev) => !prev);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            console.log(e);
                            setExpanded((prev) => !prev);
                        }
                    }}
                >
                    <div className='flex flex-col items-start'>
                        <div className='pb-1.5 flex flex-col items-start'>
                            <div className='text-[12px] text-[rgb(109,109,109)]'>Listing ID</div>
                            <div className='text-[20px] text-black'>{listing.dispatchId}</div>
                        </div>
                    </div>
                    <div className='flex flex-col items-start'>
                        <div className='pb-1.5 flex flex-col items-start'>
                            <div className='text-[12px] text-[rgb(109,109,109)]'>Pick-Up Location</div>
                            <div className='text-[16px] text-[rgb(0,91,168)]'>{listing.pickupLocation}</div>
                        </div>
                        <div className='pb-1.5 flex flex-col items-start'>
                            <div className='text-[12px] text-[rgb(109,109,109)]'>Delivery Location</div>
                            <div className='text-[16px] text-[rgb(0,91,168)]'>{listing.dropoffLocation}</div>
                        </div>
                    </div>
                    <div className='flex flex-col items-start'>
                        <div className='pb-1.5 flex flex-col items-start'>
                            <div className='text-[12px] text-[rgb(109,109,109)]'>Vehicle Info</div>
                            <div>
                                {listing.vehicleInfo.length > 0 &&
                                    <ul>
                                        {listing.vehicleInfo.map((vehicle, key) => (
                                            <li key={key}>
                                                {vehicle.year} {vehicle.make} {vehicle.model}
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-start'>
                        <div className='pb-1.5 flex flex-col items-start'>
                            <div className='text-[12px] text-[rgb(109,109,109)]'>Pick-Up Date</div>
                            <div>{listing.pickupDate.toLocaleDateString()}</div>
                        </div>
                        <div className='pb-1.5 flex flex-col items-start'>
                            <div className='text-[12px] text-[rgb(109,109,109)]'>Dropoff Date</div>
                            <div>{listing.dropoffDate.toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center justify-center'>
                            <svg className={`transition duration-300 ease-[cubic-bezier(0.5,1,0.89,1)] ${expanded ? 'rotate-180' : 'rotate-0'}`}
                                xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' aria-hidden='true' width='1em' height='1em' color='#005ba8'>
                                <path d='M8.004 12.19a.625.625 0 01-.446-.187L.433 4.753a.625.625 0 01.892-.877l6.68 6.797 6.678-6.797a.625.625 0 11.892.877l-7.125 7.25a.625.625 0 01-.446.187z'></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`grid transition duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className='overflow-hidden'>
                    <div className='p-2'>
                        <Tabs
                            {...tabProps}
                            styles={stylesObject}
                        />
                    </div>
                </div>
            </div>

            <div className='flex items-center px-1 justify-between bg-gray-200 py-2'>
                <p className='text-[14px] font-bold px-2'>${listing.price}</p>
                <div className='flex gap-1'>
                    <Button type='primary' classNames={buttonClassNames}>Assign</Button>
                </div>
            </div>
        </div>
    );
};

export default DistpatchListing;;