import type { DispatchSearchFilters } from "../components/DipsatchListing/SearchFilters";

export const debounce = (func: (values: DispatchSearchFilters, size: number) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (values : DispatchSearchFilters, size: number) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => func(values, size), delay);
    };
};

export const debounceSeek = (func: (values: string | undefined) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (values : string | undefined) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => func(values), delay);
    };
};
