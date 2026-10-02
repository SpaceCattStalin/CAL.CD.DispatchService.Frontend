import { test, expect } from 'vitest';
import { authReducer } from './authReducer';
import type { AuthState } from '../../types/Auth';
import type { PayloadAction } from '../AuthContext';

test("sign in should store identity", () => {
    const state: AuthState = {
        isAuthenticated: false,
        identity: null,
        payload: null
    };
    const action: PayloadAction<AuthState> = {
        type: 'SIGN_IN',
        payload: {
            isAuthenticated: true,
            identity: { accessToken: "test-token-1234", expiresAt: "2026-09-28T06:53:42.7489422Z" }
        }
    };

    const result = authReducer(state, action);

    expect(result).toEqual({
        isAuthenticated: true,
        identity: { accessToken: "test-token-1234", expiresAt: "2026-09-28T06:53:42.7489422Z" },
        payload: null
    });
});

test("sign in should preserve fields not present in the payload", () => {
    const state: AuthState = {
        isAuthenticated: false,
        identity: { accessToken: "existing-token", expiresAt: "2026-09-28T06:53:42.7489422Z" },
        payload: null
    };
    const action: PayloadAction<AuthState> = {
        type: 'SIGN_IN',
        payload: { isAuthenticated: true }
    };

    const result = authReducer(state, action);

    expect(result.identity).toBe(state.identity);
    expect(result.isAuthenticated).toBe(true);
});

test("sign out should clear localStorage and reset auth state", () => {
    localStorage.setItem('identity', JSON.stringify({ accessToken: 'test-token-1234' }));
    localStorage.setItem('isAuthenticated', JSON.stringify(true));

    const state: AuthState = {
        isAuthenticated: true,
        identity: { accessToken: "test-token-1234", expiresAt: "2026-09-28T06:53:42.7489422Z" },
        payload: null
    };
    const action: PayloadAction<AuthState> = { type: 'SIGN_OUT', payload: {} };

    const result = authReducer(state, action);

    expect(localStorage.getItem('identity')).toBeNull();
    expect(localStorage.getItem('isAuthenticated')).toBeNull();
    expect(result).toEqual({ isAuthenticated: false });
});

test("unknown action type returns state unchanged", () => {
    const state: AuthState = { isAuthenticated: true, identity: null, payload: null };
    const action = { type: 'UNKNOWN', payload: {} } as unknown as PayloadAction<AuthState>;

    const result = authReducer(state, action);

    expect(result).toBe(state);
});