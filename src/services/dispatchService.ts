import dayjs from "dayjs";
import axiosInstance from "./axiosInstance";
import type { DispatchStatus } from "../types/Dispatch";
import type { LoadProps, Company } from "../components/Load/Load";
import type { DispatchSearchFilters } from "../components/common/SearchFilters";
import type { SortValue, SortField } from "../components/common/SortControl";
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

type CompanyResponse = {
    companyId: string;
    companyName: string;
    companyPhone: string;
    companyEmail: string;
};

type getDispatchResponse = {
    dispatchId: string;
    shipper: CompanyResponse | null;
    carrier: CompanyResponse | null;
    dispatchStatus: DispatchStatus;
    price: number;
    pickupDate: string;
    dropoffDate: string;
    description: string | null;
    isSigned: boolean;
    pickupStop: StopResponse | null;
    dropoffStop: StopResponse | null;
    vehicles: VehicleResponse[] | null;
    drivers: DriverResponse[] | null;
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

type SortDirectionRequest = 'ASCENDING' | 'DESCENDING';

type SortFieldRequest = {
    name: string;
    direction: SortDirectionRequest;
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
    sortFields: SortFieldRequest[];
};

// Maps the frontend's sort field keys to the backend's sortable property names.
const SORT_FIELD_NAME_MAP: Record<SortField, string> = {
    createdAt: 'createdAt',
    price: 'priceTotal',
};

export const buildDispatchSearchRequest = (
    filters: DispatchSearchFilters,
    currentPage = 1,
    pageSize = 10,
    sort?: SortValue,
): DispatchSearchRequestModel => {
    return {
        priceTotalMin: filters.priceMin ?? null,
        priceTotalMax: filters.priceMax ?? null,
        pickupDateFrom: filters.pickupDateRange?.[0].toISOString() ?? null,
        pickupDateTo: filters.pickupDateRange?.[1].toISOString() ?? null,
        dropoffDateFrom: filters.dropoffDateRange?.[0].toISOString() ?? null,
        dropoffDateTo: filters.dropoffDateRange?.[1].toISOString() ?? null,
        dispatchStatus: filters.status?.map((status) => status) ?? null,
        vehicleVin: filters.vin ?? null,
        size: pageSize,
        currentPage,
        sortFields: sort
            ? [{ name: SORT_FIELD_NAME_MAP[sort.field], direction: sort.direction === 'asc' ? 'ASCENDING' : 'DESCENDING' }]
            : [],
    };
};

export const getDispatchBatch = async (request: DispatchSearchRequestModel): Promise<DispatchBatchResult> => {
    const response = await axiosInstance.post<getDispatchBatchResponse>("/dispatch/search", { ...request });

    return {
        items: response.data.found.map((item) => toLoadProps(item)),
        total: response.data.total,
    };
};

export const getSingleDispatch = async (dispatchId: string | null): Promise<LoadProps> => {
    const response = await axiosInstance.get<getDispatchResponse>(`/dispatch/${dispatchId}`);

    return toLoadProps(response.data);
};

const toStop = (stop: StopResponse | null): Stop => ({
    address: stop?.address ?? '',
    locationName: stop?.locationName ?? '',
    contactName: stop?.contactName ?? '',
    contactPhone: stop?.contactPhone ?? '',
    contactEmail: stop?.contactEmail ?? '',
});

const toCompany = (company: CompanyResponse | null): Company => ({
    companyName: company?.companyName ?? '',
    companyPhone: company?.companyPhone ?? '',
    companyEmail: company?.companyEmail ?? '',
});

const toLoadProps = (dispatch: getDispatchResponse): LoadProps => {
    const [firstDriver] = dispatch.drivers ?? [];
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
        description: dispatch.description ?? '',

        carrierInfo: toCompany(dispatch.carrier),
        shipperInfo: toCompany(dispatch.shipper),

        driverInfo: firstDriver
            ? {
                userId: firstDriver.driverId,
                fullName: `${firstDriver.firstName} ${firstDriver.lastName}`.trim(),
                phone: firstDriver.phone,
                email: firstDriver.email,
            }
            : { userId: '', fullName: '', phone: '', email: '' },
        vehicleInfo: (dispatch.vehicles ?? []).map((vehicle) => ({
            vehicleId: vehicle.vehicleId,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            color: vehicle.color ?? '',
            vin: vehicle.vin ?? '',
        })),
        listingCreatedAt: new Date(dispatch.createdAt),
        listingUpdatedAt: new Date(dispatch.createdAt),
        price: dispatch.price,
    };
};


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

type UpdateDispatchRequest = {
    price: number;
    pickupDate: string;
    dropoffDate: string;
    description?: string;
    pickupStop: StopRequest;
    dropoffStop: StopRequest;
    vehicles: UpdateVehicleRequest[];
};

export type DispatchMutationResult = {
    dispatch: LoadProps;
    location: string;
};

export const createDispatch = async (request: CreateDispatchRequest): Promise<DispatchMutationResult> => {
    const response = await axiosInstance.post<getDispatchResponse>('/dispatch', request);
    return { dispatch: toLoadProps(response.data), location: response.headers['location'] };
};

export const updateDispatch = async (dispatchId: string, request: UpdateDispatchRequest): Promise<DispatchMutationResult> => {
    const response = await axiosInstance.put<getDispatchResponse>(`/dispatch/${dispatchId}`, request);
    return { dispatch: toLoadProps(response.data), location: response.headers['location'] };
};

export const toCreateDispatchRequest = (values: DispatchFormValues): CreateDispatchRequest => ({
    carrierId: values.carrierId!,
    price: values.price,
    pickupDate: values.pickupDate.toISOString(),
    dropoffDate: values.dropoffDate.toISOString(),
    description: values.description || '',
    pickupStop: values.pickupStop,
    dropoffStop: values.dropoffStop,
    vehicles: values.vehicles.map((vehicle) => ({
        vin: vehicle.vin || '',
        year: vehicle.year!,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color || '',
    })),
});

export const toUpdateDispatchRequest = (values: DispatchFormValues): UpdateDispatchRequest => ({
    price: values.price,
    pickupDate: values.pickupDate.toISOString(),
    dropoffDate: values.dropoffDate.toISOString(),
    description: values.description || '',
    pickupStop: values.pickupStop,
    dropoffStop: values.dropoffStop,
    vehicles: values.vehicles.map((vehicle) => ({
        vehicleId: vehicle.vehicleId,
        vin: vehicle.vin || '',
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color || '',
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
