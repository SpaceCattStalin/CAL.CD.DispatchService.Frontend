import type { Vehicle } from '../../types/Vehicle';
import { Divider } from 'antd';

type VehicleInfoTabProps = {
  vehicles: Vehicle[];
};

const VehicleInfoTab = ({ vehicles }: VehicleInfoTabProps) => {
  return (
    <div className='flex flex-col items-start'>
      <div className='pb-5 text-[16px] text-[rgb(0,91,168)] font-bold'>{vehicles.length} Total Vehicles</div>

      <div className='w-full'>
        <ul className='list-none pl-0'>
          {vehicles.map((vehicle, key) => (
            <li key={key} className='grid grid-cols-2'>
              <div className='flex flex-col items-start'>
                <div className='text-[12px] text-[rgb(109,109,109)] leading-tight'>
                  Vehicle
                </div>
                <div className='text-[14px] text-black font-bold leading-tight'>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </div>
                <div className='text-[12px] leading-loose'>{vehicle.vin}</div>
              </div>
              <div className='flex flex-col items-start'>
                <div className='text-[12px] text-[rgb(109,109,109)] leading-tight'>Vehicle Color</div>
                <div className='text-[14px] text-black font-normal leading-tight'>{vehicle.color}</div>
              </div>
              {key !== vehicles.length - 1 && <Divider
                size='medium'
                className='col-span-2'
                style={{ borderBlockStartColor: '#9ca3af', borderBlockStartWidth: 1 }}
              />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VehicleInfoTab;