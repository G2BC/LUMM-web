import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCountryTypeFlags } from "@/hooks/useCountryTypeFlags";

type CountryTypeIconProps = {
  country: string | null;
  description?: string;
  className?: string;
  imageClassName?: string;
};

export function CountryTypeIcon({
  country,
  description,
  className = "inline-flex",
  imageClassName = "h-12 w-12 xl:h-16 xl:w-16 shrink-0",
}: CountryTypeIconProps) {
  const iconUrl = useCountryTypeFlags(country);
  const hasTooltipContent = !!description;

  if (!iconUrl) return null;

  const image = (
    <img src={iconUrl} alt={country || ""} className={imageClassName} aria-label={country || ""} />
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
          {description ? <p>{description}</p> : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
