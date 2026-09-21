import type { AuthState } from "../../types/Auth";
import type { PayloadAction } from "../AuthContext";

export const authReducer = (state: AuthState, action: PayloadAction<AuthState>) => {
    switch (action.type) {
        case 'SIGN_IN':
            return { ...state, ...action.payload };
        case 'SIGN_OUT':
            localStorage.removeItem("identity");
            localStorage.removeItem("isAuthenticated");
            return { isAuthenticated: false };
        default:
            return state;
    }
};