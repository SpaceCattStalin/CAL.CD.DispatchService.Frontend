import dayjs from "dayjs";
import axiosInstance from "./axiosInstance";
import type { DispatchStatus } from "../types/Dispatch";
import type { LoadProps } from "../components/Load/Load";
import type { DispatchSearchFilters } from "../components/common/SearchFilters";
import type { DispatchFormValues } from "../components/common/DispatchForm";
import type { Stop } from "../types/Stop";

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
    carrierCompanyName: string;
    carrierCompanyPhone: string;
    carrierCompanyEmail: string;
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
    const response = await axiosInstance.get<getDispatchResponse>(`/dispatch/${dispatchId}`);

    return toLoadProps(response.data);
};

const toStop = (stop: StopResponse | null): Stop => ({
    address: stop?.address ?? '',
    locationName: stop?.locationName ?? undefined,
    contactName: stop?.contactName ?? undefined,
    contactPhone: stop?.contactPhone ?? undefined,
    contactEmail: stop?.contactEmail ?? undefined,
});

const toLoadProps = (dispatch: getDispatchResponse): LoadProps => {
    const [firstDriver] = dispatch.drivers;
    const pickupStop = toStop(dispatch.pickupStop);
    const dropoffStop = toStop(dispatch.dropoffStop);

    return {
        dispatchId: dispatch.dispatchId,
        pickupLocation: pickupStop.address,
        pickupStop,
        dispatchStatus: dispatch.dispatchStatus,
        pickupDate: new Date(dispatch.pickupDate),
        dropoffLocation: dropoffStop.address,
        dropoffStop,
        dropoffDate: new Date(dispatch.dropoffDate),
        description: dispatch.description ?? undefined,
        // Search only gives us the carrier's id, not its name/phone/email
        carrierInfo: {
            carrierCompanyName: dispatch.carrierCompanyName,
            carrierCompanyPhone: dispatch.carrierCompanyPhone,
            carrierCompanyEmail: dispatch.carrierCompanyEmail
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
            vehicleId: vehicle.vehicleId,
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

// --- Create / Update ---

type StopRequest = {
    address: string;
    locationName?: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
};

type VehicleRequestCreate = {
    vin?: string;
    year: number;
    make: string;
    model: string;
    color?: string;
};

type UpdateVehicleRequest = {
    vehicleId: string;
    vin?: string;
    year?: number;
    make?: string;
    model?: string;
    color?: string;
};

type CreateDispatchRequest = {
    carrierId: string;
    price: number;
    pickupDate: string;
    dropoffDate: string;
    description?: string;
    pickupStop: StopRequest;
    dropoffStop: StopRequest;
    vehicles: VehicleRequestCreate[];
};

// No carrierId, no dispatchStatus — the backend's PUT contract doesn't accept either
// (carrier can't change on update; status is shown read-only until the backend adds support).
type UpdateDispatchRequest = {
    price: number;
    pickupDate: string;
    dropoffDate: string;
    description?: string;
    pickupStop: StopRequest;
    dropoffStop: StopRequest;
    vehicles: UpdateVehicleRequest[];
};

export const createDispatch = async (request: CreateDispatchRequest): Promise<LoadProps> => {
    const response = await axiosInstance.post<getDispatchResponse>('/dispatch', request);
    return toLoadProps(response.data);
};

export const updateDispatch = async (dispatchId: string, request: UpdateDispatchRequest): Promise<LoadProps> => {
    const response = await axiosInstance.put<getDispatchResponse>(`/dispatch/${dispatchId}`, request);
    return toLoadProps(response.data);
};

export const toCreateDispatchRequest = (values: DispatchFormValues): CreateDispatchRequest => ({
    carrierId: values.carrierId!,
    price: values.price,
    pickupDate: values.pickupDate.toISOString(),
    dropoffDate: values.dropoffDate.toISOString(),
    description: values.description || undefined,
    pickupStop: values.pickupStop,
    dropoffStop: values.dropoffStop,
    vehicles: values.vehicles.map((vehicle) => ({
        vin: vehicle.vin || undefined,
        year: vehicle.year!,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color || undefined,
    })),
});

export const toUpdateDispatchRequest = (values: DispatchFormValues): UpdateDispatchRequest => ({
    price: values.price,
    pickupDate: values.pickupDate.toISOString(),
    dropoffDate: values.dropoffDate.toISOString(),
    description: values.description || undefined,
    pickupStop: values.pickupStop,
    dropoffStop: values.dropoffStop,
    vehicles: values.vehicles.map((vehicle) => ({
        vehicleId: vehicle.vehicleId,
        vin: vehicle.vin || undefined,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color || undefined,
    })),
});

export const toDispatchFormValues = (dispatch: LoadProps): Partial<DispatchFormValues> => ({
    price: dispatch.price,
    pickupDate: dayjs(dispatch.pickupDate),
    dropoffDate: dayjs(dispatch.dropoffDate),
    description: dispatch.description,
    pickupStop: dispatch.pickupStop,
    dropoffStop: dispatch.dropoffStop,
    vehicles: dispatch.vehicleInfo.map((vehicle) => ({
        vehicleId: vehicle.vehicleId ?? crypto.randomUUID(),
        vin: vehicle.vin,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
    })),
});
