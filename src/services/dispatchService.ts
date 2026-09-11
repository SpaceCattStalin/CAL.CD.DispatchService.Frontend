import axiosInstance from "./axiosInstance";
import type { DispatchStatus } from "../types/Dispatch";
import type { LoadProps } from "../components/Load/Load";
import type { DispatchSearchFilters } from "../components/DipsatchListing/SearchFilters";

type StopResponse = {
    stopId: string;
    stopNumber: string;
    address: string;
    locationName: string | null;
    contactName: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
};

type VehicleResponse = {
    vehicleId: string;
    vehicleStatus: string;
    vin: string | null;
    year: number;
    make: string;
    model: string;
    color: string | null;
    pickupStop: StopResponse;
    dropoffStop: StopResponse;
};

type DriverResponse = {
    driverId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
};

type getDispatchResponse = {
    dispatchId: string;
    shipperId: string;
    carrierId: string;
    dispatchStatus: DispatchStatus;
    price: number;
    pickupDate: string;
    dropoffDate: string;
    description: string | null;
    isSigned: boolean;
    pickupStop: StopResponse | null;
    dropoffStop: StopResponse | null;
    vehicles: VehicleResponse[];
    drivers: DriverResponse[];
    createdAt: string;
};

type getDispatchBatchResponse = {
    found: getDispatchResponse[],
    notFound: string[];
    total: number;
};

export type DispatchBatchResult = {
    items: LoadProps[];
    total: number;
};

type DispatchSearchRequestModel = {
    priceTotalMin: number | null;
    priceTotalMax: number | null;
    pickupDateFrom: string | null;
    pickupDateTo: string | null;
    dropoffDateFrom: string | null;
    dropoffDateTo: string | null;
    dispatchStatus: DispatchStatus[] | null;
    vehicleVin: string | null;
    size: number | null;
    currentPage: number | null;
};


export const buildDispatchSearchRequest = (
    filters: DispatchSearchFilters,
    currentPage = 1,
    pageSize = 10,
): DispatchSearchRequestModel => ({
    priceTotalMin: filters.priceMin ?? null,
    priceTotalMax: filters.priceMax ?? null,
    pickupDateFrom: filters.pickupDateRange?.[0].toISOString() ?? null,
    pickupDateTo: filters.pickupDateRange?.[1].toISOString() ?? null,
    dropoffDateFrom: filters.dropoffDateRange?.[0].toISOString() ?? null,
    dropoffDateTo: filters.dropoffDateRange?.[1].toISOString() ?? null,
    dispatchStatus: filters.status?.map((status) => status) ?? null,
    vehicleVin: filters.vin ?? null,
    size: pageSize,
    currentPage
});

export const getDispatchBatch = async (request: DispatchSearchRequestModel): Promise<DispatchBatchResult> => {
    const response = await axiosInstance.post<getDispatchBatchResponse>("/dispatch/search", { ...request });

    return {
        items: response.data.found.map((item) => toLoadProps(item)),
        total: response.data.total,
    };
};

export const getSingleDispatch = async (dispatchId: string | undefined): Promise<LoadProps> => {
    const response = await axiosInstance.get<getDispatchResponse>(`/dispatch/${ dispatchId }`);

    return toLoadProps(response.data);
};

const toLoadProps = (dispatch: getDispatchResponse): LoadProps => {
    const [firstDriver] = dispatch.drivers;

    return {
        dispatchId: dispatch.dispatchId,
        pickupLocation: dispatch.pickupStop?.address ?? '',
        dispatchStatus: dispatch.dispatchStatus,
        pickupDate: new Date(dispatch.pickupDate),
        dropoffLocation: dispatch.dropoffStop?.address ?? '',
        dropoffDate: new Date(dispatch.dropoffDate),
        // Search only gives us the carrier's id, not its name/phone/email
        carrierInfo: {
            companyId: dispatch.carrierId,
            type: '',
            companyName: '',
            companyPhone: '',
            companyEmail: '',
        },
        // A dispatch can have multiple drivers; LoadProps only has room for one, so we take the first.
        driverInfo: firstDriver
            ? {
                userId: firstDriver.driverId,
                fullName: `${firstDriver.firstName} ${firstDriver.lastName}`.trim(),
                phone: firstDriver.phone,
                email: firstDriver.email,
            }
            : { userId: '', fullName: '', phone: '', email: '' },
        vehicleInfo: dispatch.vehicles.map((vehicle) => ({
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            color: vehicle.color ?? '',
            vin: vehicle.vin ?? '',
        })),
        listingCreatedAt: new Date(dispatch.createdAt),
        // No separate "updated at" field exists on getDispatchResponse yet — falls back to createdAt.
        listingUpdatedAt: new Date(dispatch.createdAt),
        price: dispatch.price,
    };
};
