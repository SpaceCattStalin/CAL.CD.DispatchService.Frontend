import type { DispatchStatus } from '../../types/Dispatch';

export type StatusBadgeProps = {
    status: DispatchStatus;
};

const STATUS_LABELS: Record<DispatchStatus, string> = {
    NotSigned: 'Not Signed',
    PendingPickup: 'Pending Pickup',
    PendingDelivery: 'Pending Delivery',
    Delivered: 'Delivered',
    Canceled: 'Canceled',
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const statusStyle: Record<DispatchStatus, string> = {
        "NotSigned": "bg-[rgb(255,243,205)] text-[rgb(133,100,4)]",
        "PendingPickup": "bg-[rgb(224,231,255)] text-[rgb(55,65,163)]",
        "PendingDelivery": "bg-[rgb(204,246,247)] text-[rgb(13,111,120)]",
        "Delivered": "bg-[rgb(201,234,191)] text-[rgb(43,102,32)]",
        "Canceled": "bg-[rgb(255,209,209)] text-[rgb(163,29,29)]"
    };

    return (
        <div className={`flex rounded-[999px] text-[12px] px-2 py-1 font-bold ${statusStyle[status]}`}>
            <p>{STATUS_LABELS[status]}</p>
        </div>
    );
};

export default StatusBadge;
