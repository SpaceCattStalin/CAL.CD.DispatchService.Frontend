import { createContext, useContext, type Dispatch } from "react";
import type { AuthState } from "../types/Auth";

type AuthActionType = 'SIGN_IN' | 'SIGN_OUT';

export interface PayloadAction<T> {
    type: AuthActionType;
    payload: T;
}

export interface AuthContextType extends AuthState {
    dispatch: Dispatch<PayloadAction<AuthState>>;
}

export const initialState: AuthState = {
    isAuthenticated: false,
    identity: null
};

export const AuthContext = createContext<AuthContextType>({
    ...initialState,
    dispatch: () => null
});

export const useAuth = () => useContext(AuthContext);