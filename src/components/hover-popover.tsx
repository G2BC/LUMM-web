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
        <span
          className={cn(
            !triggerClassName && "underline decoration-dotted",
            "cursor-pointer select-none",
            triggerClassName
          )}
          onPointerDown={(e) => e.preventDefault()}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {trigger}
        </span>
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
