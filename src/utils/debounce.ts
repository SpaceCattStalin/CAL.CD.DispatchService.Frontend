import type { DispatchSearchFilters } from "../components/common/SearchFilters";
import type { SortValue } from "../components/common/SortControl";

export const debounce = (func: (values: DispatchSearchFilters, size: number, sort: SortValue) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (values: DispatchSearchFilters, size: number, sort: SortValue) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => func(values, size, sort), delay);
    };
};

export const debounceSeek = (func: (values: string | null) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (values: string | null) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => func(values), delay);
    };
};
