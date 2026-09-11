import type { Dayjs } from 'dayjs';
import type { DispatchSearchFilters } from '../components/DipsatchListing/SearchFilters';
import type { LoadProps } from '../components/Load/Load';

const isWithinDateRange = (date: Date, range?: [Dayjs, Dayjs]) => {
    if (!range) return true;
    const [from, to] = range;
    const time = date.getTime();
    return time >= from.startOf('day').valueOf() && time <= to.endOf('day').valueOf();
};

export const filterDispatches = (
    dispatches: LoadProps[],
    filters: DispatchSearchFilters,
): LoadProps[] => {
    return dispatches.filter((dispatch) => {
        if (filters.dispatchId && !dispatch.dispatchId.toLowerCase().includes(filters.dispatchId.toLowerCase())) {
            return false;
        }

        if (filters.status && filters.status.length > 0 && !filters.status.includes(dispatch.dispatchStatus)) {
            return false;
        }

        if (!isWithinDateRange(dispatch.pickupDate, filters.pickupDateRange)) {
            return false;
        }

        if (!isWithinDateRange(dispatch.dropoffDate, filters.dropoffDateRange)) {
            return false;
        }

        if (filters.priceMin !== undefined && dispatch.price < filters.priceMin) {
            return false;
        }

        if (filters.priceMax !== undefined && dispatch.price > filters.priceMax) {
            return false;
        }

        if (filters.vin) {
            const vin = filters.vin.toLowerCase();
            const hasMatchingVehicle = dispatch.vehicleInfo.some((vehicle) => vehicle.vin.toLowerCase().includes(vin));
            if (!hasMatchingVehicle) return false;
        }

        return true;
    });
};
