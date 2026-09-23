import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { CompanyType } from '../types/Auth';

const RequireCompanyType = ({ allow, children }: { allow: CompanyType[]; children: React.ReactNode; }) => {
    const { payload } = useAuth();
    if (!payload || !allow.includes(payload.company_type)) return <Navigate to="/" replace />;

    return children;
};

export default RequireCompanyType;
