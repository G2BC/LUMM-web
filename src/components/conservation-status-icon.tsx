import { useIucnIcon } from "@/hooks/useIucnIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ConservationStatusIconProps = {
  code?: string | null;
  label?: string;
  description?: string;
  className?: string;
  imageClassName?: string;
};

const normalizeConservationCode = (value?: string | null) => {
  const code = (value || "").trim().toUpperCase();
  return !code || code === "NONE" ? "NE" : code;
};

export function ConservationStatusIcon({
  code,
  label,
  description,
  className = "inline-flex",
  imageClassName = "h-12 w-12 xl:h-16 xl:w-16 shrink-0",
}: ConservationStatusIconProps) {
  const normalizedCode = normalizeConservationCode(code);
  const iconUrl = useIucnIcon(normalizedCode);
  const hasTooltipContent = Boolean(label || description);

  if (!iconUrl) return null;

  const image = (
    <img
      src={iconUrl}
      alt={normalizedCode}
      className={imageClassName}
      aria-label={`${normalizedCode}${label ? ` - ${label}` : ""}`}
    />
  );

  if (!hasTooltipContent) {
    return <span className={className}>{image}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={className}>{image}</span>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-80 border border-white/20 bg-black/90 px-3 py-2 text-xs leading-relaxed text-white/90 shadow-lg"
        >
          {label ? (
            <p className="font-semibold text-white">{`${normalizedCode}${label ? ` - ${label}` : ""}`}</p>
          ) : null}
          {description ? <p className={label ? "mt-1" : ""}>{description}</p> : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
