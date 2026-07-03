import { Star } from "lucide-react";

export function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${cls} ${i < Math.floor(rating) ? "fill-accent text-accent" : "text-border"}`} />
      ))}
    </div>
  );
}
