import type { PlagueTagKind } from "@/lib/api/types";
import { t } from "@/lib/i18n/es";

export function PlagueTag({ kind }: { kind: PlagueTagKind }) {
  return (
    <span className="inline-flex items-center h-7 rounded-md bg-gray-5 px-2.5 text-sm text-gray-1 font-bold">
      {t.plagueTags[kind]}
    </span>
  );
}
