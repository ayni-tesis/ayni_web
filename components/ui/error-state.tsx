import { AlertCircle, RotateCw } from "lucide-react";
import { t } from "@/lib/i18n/es";

type ErrorStateProps = {
  title?: string;
  body?: string;
  onRetry?: () => void;
  retrying?: boolean;
};

export function ErrorState({
  title = t.errors.loadFailed.title,
  body = t.errors.loadFailed.body,
  onRetry,
  retrying = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center gap-3 px-6 py-12"
    >
      <div className="h-12 w-12 rounded-full bg-[#FFE5E5] text-error flex items-center justify-center">
        <AlertCircle size={22} />
      </div>
      <div>
        <p className="text-base font-bold text-black-2">{title}</p>
        <p className="text-sm text-gray-2 mt-1 max-w-sm">{body}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="press focus-ring h-10 px-4 mt-2 rounded-full bg-black-2 text-white text-sm font-bold inline-flex items-center gap-2 hover:opacity-85 disabled:opacity-50 transition-opacity"
        >
          <RotateCw
            size={16}
            className={retrying ? "animate-spin" : undefined}
          />
          {t.common.retry}
        </button>
      )}
    </div>
  );
}
