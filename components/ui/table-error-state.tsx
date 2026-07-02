import { ErrorState } from "@/components/ui/error-state";

export function TableErrorState({
  colSpan,
  onRetry,
  retrying,
}: {
  colSpan: number;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <ErrorState onRetry={onRetry} retrying={retrying} />
      </td>
    </tr>
  );
}
