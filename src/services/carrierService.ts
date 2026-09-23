import axiosInstance from './axiosInstance';

export type CarrierOption = {
    value: string;
    label: string;
};

type CarrierResponse = {
    companyId: string;
    companyName: string;
    companyPhone: string;
    companyEmail: string;
};

export const getCarriers = async (): Promise<CarrierOption[]> => {
    const response = await axiosInstance.get<CarrierResponse[]>('/company/carriers');
    return response.data.map((carrier) => ({
        value: carrier.companyId,
        label: carrier.companyName,
    }));
};
