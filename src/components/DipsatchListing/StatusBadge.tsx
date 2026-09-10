export type StatusBadgeProps = {
    status: "Listed" | "Archived" | "Draft" | "Not Listed";
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const statusStyle: Record<StatusBadgeProps['status'], string> = {
        "Listed": "bg-[rgb(201,234,191)] text-[rgb(43,102,32)]",
        "Archived": "bg-[rgb(227,227,227)] text-[rgb(80,80,80)]",
        "Draft": "bg-[rgb(255,255,255)] text-[rgb(109,109,109)] border border-[rgb(227,227,227)]",
        "Not Listed": "bg-[rgb(255,209,209)] text-[rgb(163,29,29)]"
    };

    return (
        <div className={`flex rounded-[999px] text-[12px] px-2 py-1 font-bold ${statusStyle[status]}`}>
            <p>{status}</p>
        </div>
    );
};

export default StatusBadge;