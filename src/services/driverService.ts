import axiosInstance from './axiosInstance';

export type DriverOption = {
    value: string;
    label: string;
};

type DriverResponse = {
    driverId: string;
    firstName: string;
    lastName: string;
};

export const getDrivers = async (): Promise<DriverOption[]> => {
    const response = await axiosInstance.get<DriverResponse[]>('/company/drivers');
    return response.data.map((driver) => ({
        value: driver.driverId,
        label: `${driver.firstName} ${driver.lastName}`.trim(),
    }));
};