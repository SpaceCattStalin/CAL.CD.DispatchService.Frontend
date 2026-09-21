import { Button, Popover } from 'antd';
import type { JwtPayload } from '../../types/Auth';

export type ProfileMenuProps = {
    payload: JwtPayload;
    onLogout: () => void;
};

const ProfileMenu = ({ payload, onLogout }: ProfileMenuProps) => {
    const content = (
        <div className='flex flex-col gap-3 w-56'>
            <div className='flex flex-col gap-1 text-[13px]'>
                <div className='flex justify-between gap-4'>
                    <span className='text-[#6a7282]'>Username</span>
                    <span className='font-medium'>{payload.user_name}</span>
                </div>
                <div className='flex justify-between gap-4'>
                    <span className='text-[#6a7282]'>First name</span>
                    <span className='font-medium'>{payload.first_name}</span>
                </div>
                <div className='flex justify-between gap-4'>
                    <span className='text-[#6a7282]'>Last name</span>
                    <span className='font-medium'>{payload.last_name}</span>
                </div>
                <div className='flex justify-between gap-4'>
                    <span className='text-[#6a7282]'>Role</span>
                    <span className='font-medium'>{payload.role}</span>
                </div>
                <div className='flex justify-between gap-4'>
                    <span className='text-[#6a7282]'>Company Type</span>
                    <span className='font-medium'>{payload.company_type}</span>
                </div>
            </div>
            <Button onClick={onLogout} block>Log out</Button>
        </div>
    );

    return (
        <Popover content={content} trigger='hover' placement='bottomRight'>
            <div className='text-[12px] font-medium cursor-pointer hover:text-[rgb(0,91,168)]'>
                {payload.first_name} {payload.last_name}
            </div>
        </Popover>
    );
};

export default ProfileMenu;
