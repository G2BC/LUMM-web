import { useIucnIcon } from "@/hooks/useIucnIcon";
import { HoverPopover } from "@/components/hover-popover";

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
  imageClassName = "h-12 w-12 xl:h-14 xl:w-14 shrink-0",
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
    <HoverPopover
      trigger={image}
      triggerClassName={className}
      contentClassName="max-w-80 border border-white/20 bg-black/90 px-3 py-2 text-xs leading-relaxed text-white/90 shadow-lg"
      content={
        <>
          {label ? (
            <p className="font-semibold text-white">{`${normalizedCode} - ${label}`}</p>
          ) : null}
          {description ? <p className={label ? "mt-1" : ""}>{description}</p> : null}
        </>
      }
    />
  );
}
