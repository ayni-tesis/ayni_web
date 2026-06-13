"use client";

import type { LucideIcon } from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type DropdownItem = {
  label: string;
  icon?: LucideIcon;
  destructive?: boolean;
  onSelect: () => void;
};

type DropdownMenuProps = {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  ariaLabel: string;
};

const MENU_WIDTH = 220;
const VIEWPORT_PADDING = 8;

export function DropdownMenu({
  trigger,
  items,
  align = "end",
  ariaLabel,
}: DropdownMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const left =
      align === "end"
        ? Math.max(VIEWPORT_PADDING, rect.right - MENU_WIDTH)
        : Math.min(
            window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING,
            rect.left,
          );
    setPosition({
      position: "fixed",
      top: rect.bottom + 6,
      left,
      width: MENU_WIDTH,
    });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
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

  const handleSelect = (item: DropdownItem) => {
    close();
    item.onSelect();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className="press focus-ring h-9 w-9 rounded-full text-gray-2 hover:bg-gray-5 inline-flex items-center justify-center transition-colors"
      >
        {trigger}
      </button>

      {open && position && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={position}
              className="bg-white rounded-xl border border-gray-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-1 z-50 origin-top-right"
            >
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    role="menuitem"
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "w-full h-10 px-3 rounded-lg flex items-center gap-2 text-sm font-bold text-left hover:bg-gray-5 transition-colors press",
                      item.destructive ? "text-error" : "text-black-2",
                    )}
                  >
                    {Icon && <Icon size={16} strokeWidth={2} />}
                    {item.label}
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
