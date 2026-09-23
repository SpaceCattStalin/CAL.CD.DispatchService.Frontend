import type { DispatchStatus } from '../../types/Dispatch';


export const STATUS_LABELS: Record<DispatchStatus, string> = {
    NotSigned: 'Not Signed',
    PendingPickup: 'Dispatched',
    PendingDelivery: 'Picked Up',
    Delivered: 'Delivered',
    Canceled: 'Canceled',
};
