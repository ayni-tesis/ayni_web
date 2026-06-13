type TopProgressBarProps = {
  visible: boolean;
};

/**
 * Barra de progreso indeterminada de 2 px sobre el contenedor.
 * Aparece durante refetches en background (cuando ya hay datos visibles).
 * `prefers-reduced-motion` la convierte en estático para evitar movimiento.
 */
export function TopProgressBar({ visible }: TopProgressBarProps) {
  return (
    <div
      aria-hidden={!visible}
      className={`absolute inset-x-0 top-0 h-0.5 overflow-hidden pointer-events-none transition-opacity duration-150 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-full w-1/3 bg-primary top-progress" />
    </div>
  );
}
