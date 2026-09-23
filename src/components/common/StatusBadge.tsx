import type { DispatchStatus } from '../../types/Dispatch';
import { STATUS_LABELS } from './STATUS_LABELS';

export type StatusBadgeProps = {
    status: DispatchStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const statusStyle: Record<DispatchStatus, string> = {
        "NotSigned": "bg-[#00AAA8] text-white",
        "PendingPickup": "bg-[#C1DFF2] text-[#2372A2]",
        "PendingDelivery": "bg-[#2372A2] text-white",
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
