"use client";

import {
  type CSSProperties,
  cloneElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type PopoverProps = {
  /** El trigger debe aceptar refs y los handlers que le pasamos. Usar un button. */
  trigger: ReactElement<TriggerProps>;
  children: (close: () => void) => ReactNode;
  align?: "start" | "end";
  /** Ancho mínimo del contenido del popover. */
  minWidth?: number;
};

type TriggerProps = {
  ref?: React.Ref<HTMLButtonElement>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  "aria-haspopup"?: string;
  "aria-expanded"?: boolean;
};

const VIEWPORT_PADDING = 8;

export function Popover({
  trigger,
  children,
  align = "end",
  minWidth = 240,
}: PopoverProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const width = Math.max(minWidth, rect.width);
    const left =
      align === "end"
        ? Math.max(VIEWPORT_PADDING, rect.right - width)
        : Math.min(window.innerWidth - width - VIEWPORT_PADDING, rect.left);
    setPosition({
      position: "fixed",
      top: rect.bottom + 6,
      left,
      minWidth: width,
    });
  }, [open, align, minWidth]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        contentRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    };
    const onScroll = () => close();

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, close]);

  const enhancedTrigger = cloneElement(trigger, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      trigger.props.onClick?.(e);
      setOpen((v) => !v);
    },
    "aria-haspopup": "dialog",
    "aria-expanded": open,
  });

  return (
    <>
      {enhancedTrigger}
      {open && position && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={contentRef}
              role="dialog"
              style={position}
              className="bg-white rounded-xl border border-gray-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50"
            >
              {children(close)}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
