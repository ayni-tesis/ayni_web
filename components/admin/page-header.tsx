import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-s2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-4">
      <div className="min-w-0">
        <h1 className="text-h5 md:text-h4 font-bold text-black-2 text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-base text-gray-2 mt-1 max-w-prose">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
