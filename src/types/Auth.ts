import type { LoginResponse } from "../services/identityService";

export type AuthState = {
    isAuthenticated?: boolean;
    identity?: LoginResponse | null
}