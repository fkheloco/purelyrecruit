import { APPLICATION_STATUSES, JOB_STATUSES } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
  type?: "application" | "job";
}

export function StatusBadge({ status, type = "application" }: StatusBadgeProps) {
  const statuses = type === "application" ? APPLICATION_STATUSES : JOB_STATUSES;
  const found = statuses.find((s: any) => s.value === status);
  
  const color = (found as any)?.color || "bg-gray-100 text-gray-800";
  const label = found?.label || status;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
