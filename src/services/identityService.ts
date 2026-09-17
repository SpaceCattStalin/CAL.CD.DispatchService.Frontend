import { authInstance } from "./axiosInstance";

type LoginRequest = {
    userName: string,
    password: string;
};

export type LoginResponse = {
    accessToken: string,
    expiresAt: string;
};

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await authInstance.post<LoginResponse>('/auth/login', request);
    if (response.status != 200) {
        throw new Error(`Login failed with status ${response.status}`);
    }

    localStorage.setItem("isAuthenticated", JSON.stringify(true));
    localStorage.setItem("identity", JSON.stringify({
        "accessToken": response.data.accessToken,
        "expiresAt": response.data.expiresAt
    }));

    return response.data;
};