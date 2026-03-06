import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface InlineTooltipProps {
  content: string;
  children: React.ReactNode;
}

export function InlineTooltip({ content, children }: InlineTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  }, [open]);

  if (!content || !children) return null;

  return (
    <span
      ref={triggerRef}
      className="inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open
        ? createPortal(
            <span
              role="tooltip"
              className="pointer-events-none fixed z-[99999] w-64 -translate-x-1/2 rounded-md border border-white/20 bg-black/90 px-3 py-2 text-xs leading-relaxed text-white/90 shadow-lg"
              style={{ top: `${position.top}px`, left: `${position.left}px` }}
            >
              {content}
            </span>,
            document.body
          )
        : null}
    </span>
  );
}
