import type { DispatchSearchFilters } from "../components/common/SearchFilters";

export const debounce = (func: (values: DispatchSearchFilters, size: number) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (values: DispatchSearchFilters, size: number) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => func(values, size), delay);
    };
};

export const debounceSeek = (func: (values: string | null) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (values: string | null) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => func(values), delay);
    };
};
