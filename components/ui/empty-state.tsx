import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 px-6 py-16">
      <div className="h-14 w-14 rounded-full bg-secondary text-primary flex items-center justify-center">
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className="max-w-md">
        <p className="text-base font-bold text-black-2">{title}</p>
        <p className="text-sm text-gray-2 mt-1">{body}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
