import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface HoverPopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
}

export function HoverPopover({
  trigger,
  content,
  triggerClassName,
  contentClassName,
}: HoverPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            !triggerClassName && "underline decoration-dotted",
            "cursor-pointer select-none bg-transparent p-0 border-none inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            triggerClassName
          )}
          onPointerDown={(e) => e.preventDefault()}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          {trigger}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto rounded-md border-none bg-foreground px-3 py-1.5 text-xs text-background",
          contentClassName
        )}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
