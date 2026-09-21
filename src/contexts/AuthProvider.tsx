import { useReducer } from 'react';
import { authReducer } from './auth/authReducer';
import { initialState, AuthContext } from './AuthContext';
import { base64UrlDecode } from '../utils/decoder';
import type { AuthState, JwtPayload } from '../types/Auth';
import type { LoginResponse } from '../services/identityService';

// const base64UrlEncode = (str: string) => {
//     return btoa(str)
//         .replace(/\+/g, "-")
//         .replace(/\//g, "_")
//         .replace(/=+$/, "");
// };

// export function AuthProvider({ children }: { children: React.ReactNode; }) {
//     const [authState, dispatch] = useReducer(authReducer, initialState);
//     console.log(base64UrlDecode(authState.identity?.accessToken ? authState.identity?.accessToken.split(".")[1] : base64UrlEncode("{\"error\": \"No JWT token detected\"}")));
//     console.log(JSON.parse(base64UrlDecode(authState.identity?.accessToken ? authState.identity?.accessToken.split(".")[1] : base64UrlEncode("{\"error\": \"No JWT token detected\"}"))) as JwtPayload | JwtError);
//     return <AuthContext value={{ ...authState, dispatch }}>{children}</AuthContext>;
// }

const createInitialState = (): AuthState => {
    const rawIdentity = localStorage.getItem("identity");
    const identity = rawIdentity ? JSON.parse(rawIdentity) as LoginResponse : null;

    const payload = identity ? decodeJwtPayload(identity.accessToken) : null;


    return {
        isAuthenticated: identity ? true : false,
        identity: identity,
        payload: payload
    };
};

const decodeJwtPayload = (token?: string): JwtPayload | null => {
    if (!token) return null;
    const payload = token.split(".")[1];
    return JSON.parse(base64UrlDecode(payload)) as JwtPayload;
};

export function AuthProvider({ children }: { children: React.ReactNode; }) {
    const [authState, dispatch] = useReducer(authReducer, initialState, createInitialState);

    const payload = decodeJwtPayload(authState.identity?.accessToken);

    return <AuthContext value={{ ...authState, dispatch, payload }}>{children}</AuthContext>;
}
