import type { LoginResponse } from "../services/identityService";

export type AuthState = {
    isAuthenticated?: boolean;
    identity?: LoginResponse | null;
    payload?: JwtPayload | null;
};

export type Permission =
    | "dispatches:create"
    | "dispatches:read"
    | "dispatches:update"
    | "dispatches:delete"
    | "users:create"
    | "users:read"
    | "users:update"
    | "users:delete"
    | "companies:read"
    | "companies:update";

export type CompanyType = "Shipper" | "Carrier";

export type JwtPayload = {
    aud: string;
    iss: string;
    exp: number;
    sub: string;
    user_name: string;
    role: string;
    last_name: string;
    first_name: string;
    company_id: string;
    company_name: string;
    company_type: CompanyType;
    jti: string;
    permission: Permission[];
    iat: number;
    nbf: number;
};

// export type JwtError = {
//     error: string;
// };