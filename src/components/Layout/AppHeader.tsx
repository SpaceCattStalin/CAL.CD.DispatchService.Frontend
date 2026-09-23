import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProfileMenu from '../common/ProfileMenu';

const tabClassName = ({ isActive }: { isActive: boolean; }) =>
    `h-full flex items-center px-4 text-sm font-medium border-b-4 transition-colors ${isActive
        ? 'text-[#000]! border-[#003468]'
        : 'text-[rgb(0,91,168)]! border-transparent hover:text-[rgb(0,91,168)]!'
    }`;

const AppHeader = () => {
    const navigate = useNavigate();
    const { dispatch, payload } = useAuth();

    const handleLogout = () => {
        dispatch({ type: 'SIGN_OUT', payload: {} });
        navigate('/account/login');
    };

    return (
        <div className='flex items-center justify-between h-full gap-8'>
            <div className='flex items-center justify-between h-full gap-8'>
                <img src={logo} alt='Logo' className='h-8 w-auto shrink-0 cursor-pointer' onClick={() => navigate("/")} />
                <nav className='flex items-center h-full'>
                    <NavLink to='/' end className={tabClassName}>Loads</NavLink>
                    {payload?.company_type === 'Shipper' && <NavLink to='/create' className={tabClassName}>Creating</NavLink>}
                </nav>
            </div>
            <div className='flex items-center gap-3'>
                {payload && <ProfileMenu payload={payload} onLogout={handleLogout} />}
            </div>
        </div>
    );
};

export default AppHeader;
