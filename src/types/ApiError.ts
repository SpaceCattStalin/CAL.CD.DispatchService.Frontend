import type { AxiosError } from 'axios';

// ASP.NET Core's default RFC 9110/7807 problem details error shape.
export type ProblemDetails = {
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    traceId?: string;
    timestamp?: string;
};

// Thrown for model/validation failures (400s); adds field-level error messages.
export type ValidationProblemDetails = ProblemDetails & {
    // Values are usually string[] but can be a single string; the whole field can even be a plain string.
    errors?: string | Record<string, string | string[]>;
};

export const isProblemDetails = (value: unknown): value is ProblemDetails =>
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    'status' in value;

export const getProblemDetails = (ex: unknown): ValidationProblemDetails | null => {
    const err = ex as AxiosError<ValidationProblemDetails>;
    const data = err?.response?.data;

    return isProblemDetails(data) ? data : null;
};

// Flattens `errors` (string | string[] per field, or a bare string) into a message list.
export const getErrorMessages = (problem: ValidationProblemDetails | null): string[] => {
    const errors = problem?.errors;
    if (!errors) return [];
    if (typeof errors === 'string') return [errors];
    return Object.values(errors).flat();
};

// One displayable string: field messages if any, else the title, else the fallback.
export const getErrorText = (problem: ValidationProblemDetails | null, fallback: string): string => {
    const messages = getErrorMessages(problem);
    return messages.length > 0 ? messages.join(' ') : (problem?.title ?? fallback);
};
