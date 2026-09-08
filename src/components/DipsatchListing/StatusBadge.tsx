export type StatusBadgeProps = {
    status: "Listed" | "Archived" | "Draft" | "Not Listed";
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const statusStyle: Record<StatusBadgeProps['status'], string> = {
        "Listed": "bg-[rgb(201,234,191)]",
        "Archived": "bg-[rgb(227,227,227)]",
        "Draft": "bg-[rgb(255, 255,255)]",
        "Not Listed": "bg-[rgb(255,209,209)]"
    };

    return (
        <div className={`flex rounded-[999px] text-[14px] px-2 ${statusStyle[status]}`}>
            <p>{status}</p>
        </div>
    );
};

export default StatusBadge;