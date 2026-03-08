import { useIucnIcon } from "@/hooks/useIucnIcon";

type ConservationStatusIconProps = {
  code?: string | null;
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
  description,
  className = "inline-flex",
  imageClassName = "h-12 w-12 xl:h-16 xl:w-16 shrink-0",
}: ConservationStatusIconProps) {
  const normalizedCode = normalizeConservationCode(code);
  const iconUrl = useIucnIcon(normalizedCode);

  if (!iconUrl) return null;

  return (
    <span title={description} className={className}>
      <img src={iconUrl} alt={normalizedCode} title={normalizedCode} className={imageClassName} />
    </span>
  );
}
