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
    errors?: Record<string, string[]>;
};

export const isProblemDetails = (value: unknown): value is ProblemDetails =>
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    'status' in value;

export const getProblemDetails = (ex: unknown): ProblemDetails | null => {
    const err = ex as AxiosError<ProblemDetails>;
    const data = err?.response?.data;
    return isProblemDetails(data) ? data : null;
};
