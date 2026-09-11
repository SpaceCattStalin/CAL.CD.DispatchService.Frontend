import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const tabClassName = ({ isActive }: { isActive: boolean; }) =>
    `h-full flex items-center px-4 text-sm font-medium border-b-4 transition-colors ${isActive
        ? 'text-[#000]! border-[#003468]'
        : 'text-[rgb(0,91,168)]! border-transparent hover:text-[rgb(0,91,168)]!'
    }`;

const AppHeader = () => {
    return (
        <div className='flex items-center h-full gap-8'>
            <img src={logo} alt='Logo' className='h-8 w-auto shrink-0' />
            <nav className='flex items-center h-full'>
                <NavLink to='/' end className={tabClassName}>Listing</NavLink>
                <NavLink to='/create' className={tabClassName}>Creating</NavLink>
            </nav>
        </div>
    );
};

export default AppHeader;
