import axiosInstance from './axiosInstance';

export type CarrierOption = {
    value: string;
    label: string;
};

type CarrierResponse = {
    carrierId: string;
    companyName: string;
};

// TODO(backend): no carrier-list endpoint exists yet anywhere in the backend
// (confirmed absent from the CentralDispatch/BFF source). This route is a
// placeholder — update it once the real endpoint ships. Until then this call
// will 404/error, which the carrier Select handles gracefully (empty options).
export const getCarriers = async (): Promise<CarrierOption[]> => {
    const response = await axiosInstance.get<CarrierResponse[]>('/company');
    return response.data.map((carrier) => ({
        value: carrier.carrierId,
        label: carrier.companyName,
    }));
};
