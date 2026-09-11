import type { DispatchSearchFilters } from "../components/DipsatchListing/SearchFilters";

export const debounce = (func: (values: DispatchSearchFilters) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (values : DispatchSearchFilters) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => func(values), delay);
    };
};
