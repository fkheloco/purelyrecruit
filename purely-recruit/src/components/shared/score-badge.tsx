import { getScoreCategory } from "@/lib/constants";

interface ScoreBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  if (score === null || score === undefined) {
    return <span className="text-sm text-gray-400">—</span>;
  }

  const category = getScoreCategory(score);
  if (!category) return null;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${category.bg} ${category.color} ${sizeClasses[size]}`}>
      {Math.round(score)}
    </span>
  );
}
