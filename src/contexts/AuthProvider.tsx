import { useEffect, useReducer } from 'react';
import { authReducer } from './auth/authReducer';
import { initialState, AuthContext } from './AuthContext';
import { base64UrlDecode } from '../utils/decoder';
import type { JwtPayload } from '../types/Auth';

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

const decodeJwtPayload = (token?: string): JwtPayload | null => {
    if (!token) return null;
    const payload = token.split(".")[1];
    return JSON.parse(base64UrlDecode(payload)) as JwtPayload;
};

export function AuthProvider({ children }: { children: React.ReactNode; }) {
    const [authState, dispatch] = useReducer(authReducer, initialState);

    const payload = decodeJwtPayload(authState.identity?.accessToken);
    useEffect(() => {
        console.log("Hi");
    }, []);
    // console.log(decodeJwtPayload(authState.identity?.accessToken));
    return <AuthContext value={{ ...authState, dispatch, payload }}>{children}</AuthContext>;
}
