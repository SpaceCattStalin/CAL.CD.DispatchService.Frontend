import { afterAll, beforeEach, expect, test, vi } from 'vitest';
import { debounce } from './debounce';
import type { DispatchSearchFilters } from '../components/common/SearchFilters';
import type { SortValue } from '../components/common/SortControl';

const fakeValues: DispatchSearchFilters = {
    dispatchId: null,
    status: null,
    pickupDateRange: null,
    dropoffDateRange: null,
    priceMin: null,
    priceMax: null,
    vin: null,
};
const fakeSize = 10;
const fakeSort: SortValue = { field: 'createdAt', direction: 'asc' };

beforeEach(() =>
    vi.useFakeTimers()
);

afterAll(() => {
    vi.useRealTimers();
});

test("should debounce on time", () => {
    const spy = vi.fn();

    const debouced = debounce(spy, 300);

    debouced(fakeValues, fakeSize, fakeSort);

    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(spy).toHaveBeenCalled();
});


test("should not debounce if close to time", () => {
    const spy = vi.fn();

    const debouced = debounce(spy, 300);

    debouced(fakeValues, fakeSize, fakeSort);

    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(299);
    expect(spy).not.toHaveBeenCalled();
});

test("should not debounce if time not advance", () => {
    const spy = vi.fn();

    const debouced = debounce(spy, 300);

    debouced(fakeValues, fakeSize, fakeSort);

    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(spy).not.toHaveBeenCalled();
});

test("should call after delay passes", () => {
    const spy = vi.fn();

    const debouced = debounce(spy, 300);

    debouced(fakeValues, fakeSize, fakeSort);

    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(301);
    expect(spy).toHaveBeenCalledOnce();
});


test("should collapse multiple calls into one", () => {
    const spy = vi.fn();

    const debouced = debounce(spy, 300);

    debouced(fakeValues, 10, fakeSort);
    debouced(fakeValues, 100, fakeSort);
    debouced(fakeValues, 5, fakeSort);
    debouced(fakeValues, 15, fakeSort);
    debouced(fakeValues, 7, fakeSort);

    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(fakeValues, 7, fakeSort);
});
