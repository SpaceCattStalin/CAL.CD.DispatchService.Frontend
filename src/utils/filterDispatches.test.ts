import { filterDispatches } from "./filterDispatches";
import { expect, test, beforeEach } from "vitest";
import type { LoadProps } from "../components/Load/Load";
import type { DispatchSearchFilters } from "../components/common/SearchFilters";
import type { Vehicle } from "../types/Vehicle";

function createFilters({ dispatchId, status, pickupDateRange, dropoffDateRange, priceMin, priceMax, vin }: DispatchSearchFilters): DispatchSearchFilters {
    const filters = {
        dispatchId,
        status,
        pickupDateRange,
        dropoffDateRange,
        priceMin,
        priceMax,
        vin
    };

    return { ...filters };
}

function createDispatch({ dispatchId, dispatchStatus, pickupDate, dropoffDate, price, vehicleInfo }: Partial<LoadProps>): LoadProps {
    return {
        dispatchId: dispatchId ?? '',
        pickupLocation: 'Los Angeles, CA',
        pickupStop: { address: '123 Main St, Los Angeles, CA' },
        dispatchStatus: dispatchStatus ?? "NotSigned",
        pickupDate: pickupDate ?? new Date("2024-12-01"),
        carrierInfo: { companyName: 'Acme Carriers', companyPhone: '555-0100', companyEmail: 'carrier@acme.com' },
        shipperInfo: { companyName: 'Acme Shipping', companyPhone: '555-0200', companyEmail: 'shipper@acme.com' },
        driverInfo: { userId: 'driver-1', fullName: 'John Doe', phone: '555-0300', email: 'driver@acme.com' },
        dropoffLocation: 'New York, NY',
        dropoffStop: { address: '456 Elm St, New York, NY' },
        dropoffDate: dropoffDate ?? new Date("2024-12-02"),
        vehicleInfo: vehicleInfo ?? [{ vin: "abc123" } as Vehicle],
        listingCreatedAt: new Date('2024-01-01'),
        listingUpdatedAt: new Date('2024-01-01'),
        price: price ?? 10000
    };
}


/**
 * Test data reference — values for the 6 fields createDispatch() actually
 * varies (dispatchId, dispatchStatus, pickupDate, dropoffDate, price, vehicleInfo).
 * Pair each row below with the matching filters in a test.
 *
 * dispatchId
 *   - match (case-insensitive):    dispatchId: 'DISP-001'   vs filters.dispatchId: 'disp-001'
 *   - no match:                    dispatchId: 'DISP-001'   vs filters.dispatchId: 'DISP-999'
 *
 * dispatchStatus
 *   - included in filter list:     dispatchStatus: 'Delivered'     vs filters.status: ['Delivered', 'Canceled']
 *   - not included in filter list: dispatchStatus: 'PendingPickup' vs filters.status: ['Delivered', 'Canceled']
 *   - empty status array should not filter anything out:
 *                                  dispatchStatus: 'NotSigned'     vs filters.status: []
 *
 * pickupDate (range filter uses startOf('day')/endOf('day'))
 *   - inside range:                pickupDate: new Date('2024-01-12') vs range ['2024-01-10', '2024-01-15']
 *   - outside range:               pickupDate: new Date('2024-02-01') vs range ['2024-01-10', '2024-01-15']
 *   - exact lower boundary:        pickupDate: new Date('2024-01-10T00:00:00') vs range starting '2024-01-10'
 *   - exact upper boundary:        pickupDate: new Date('2024-01-15T23:59:59') vs range ending '2024-01-15'
 *
 * dropoffDate (same rules as pickupDate)
 *   - inside range:                dropoffDate: new Date('2024-01-14')
 *   - outside range:               dropoffDate: new Date('2024-03-01')
 *   - exact lower boundary:        dropoffDate: new Date('2024-01-10T00:00:00')
 *   - exact upper boundary:        dropoffDate: new Date('2024-01-15T23:59:59')
 *
 * price vs priceMin (filtered out only when price < priceMin)
 *   - above min (pass):            price: 1500  vs filters.priceMin: 1000
 *   - below min (filtered out):    price: 500   vs filters.priceMin: 1000
 *   - equal to min (boundary, should pass): price: 1000 vs filters.priceMin: 1000
 *
 * price vs priceMax (filtered out only when price > priceMax)
 *   - below max (pass):            price: 800   vs filters.priceMax: 1000
 *   - above max (filtered out):    price: 1200  vs filters.priceMax: 1000
 *   - equal to max (boundary, should pass): price: 1000 vs filters.priceMax: 1000
 *
 * vehicleInfo / vin (partial, case-insensitive match on any vehicle)
 *   - match:                       vehicleInfo: [{ ...vehicle, vin: 'ABC123XYZ' }] vs filters.vin: 'abc123'
 *   - no match:                    vehicleInfo: [{ ...vehicle, vin: 'ABC123XYZ' }] vs filters.vin: 'ZZZ999'
 *   - match on second vehicle:     vehicleInfo: [{ ...vehicle, vin: 'AAA111' }, { ...vehicle, vin: 'BBB222' }] vs filters.vin: 'bbb'
 *
 * combined filters (interaction between two conditions)
 *   - status matches but price fails:  dispatchStatus: 'Delivered', price: 500 vs status: ['Delivered'], priceMin: 1000
 *   - dispatchId matches and vin matches: dispatchId: 'DISP-001', vehicleInfo vin 'ABC123' vs matching filters on both
 *
 * edge cases (not field values, but scenarios)
 *   - empty dispatches array passed to filterDispatches -> expect []
 *   - empty filters object ({}) -> expect all dispatches returned unchanged
 */

let dispatches: LoadProps[];

beforeEach(() => dispatches = [
    createDispatch({
        dispatchId: "DISP-001",
        dispatchStatus: "NotSigned",
        pickupDate: new Date(),
        dropoffDate: new Date(),
        price: 500,
        vehicleInfo: [{ vin: "ABC123" } as Vehicle]
    }),
    createDispatch({
        dispatchId: "DISP-002",
        dispatchStatus: "NotSigned",
        pickupDate: new Date(),
        dropoffDate: new Date(),
        price: 1500,
        vehicleInfo: [{ vin: "XYZ123" } as Vehicle]
    })
]);

test("empty dispatch id", () => {
    const filters = createFilters({
        dispatchId: null,
        dropoffDateRange: null,
        pickupDateRange: null,
        priceMax: null,
        priceMin: null,
        status: null,
        vin: null
    });

    const filteredDispatches = filterDispatches(dispatches, filters);

    expect(filteredDispatches.length).toBe(2);
});


test("valid dispatch id", () => {
    const filters = createFilters({
        dispatchId: "DISP-001",
        dropoffDateRange: null,
        pickupDateRange: null,
        priceMax: null,
        priceMin: null,
        status: null,
        vin: null
    });

    const filteredDispatches = filterDispatches(dispatches, filters);

    expect(filteredDispatches.length).toBe(1);
});


test("invalid dispatch id", () => {
    const filters = createFilters({
        dispatchId: "DISP-003",
        dropoffDateRange: null,
        pickupDateRange: null,
        priceMax: null,
        priceMin: null,
        status: null,
        vin: null
    });

    const filteredDispatches = filterDispatches(dispatches, filters);

    expect(filteredDispatches.length).toBe(0);
});