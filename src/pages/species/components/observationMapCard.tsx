import "leaflet/dist/leaflet.css";
import { fetchSpeciesObservations } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import type { IObservation } from "@/api/species/types/IObservation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;

function FitBounds({ observations }: { observations: IObservation[] }) {
  const map = useMap();
  if (observations.length === 0) return null;
  const bounds = L.latLngBounds(observations.map((o) => [o.latitude, o.longitude]));
  map.fitBounds(bounds, { padding: [32, 32], maxZoom: 10 });
  return null;
}

const SOURCE_COLORS = {
  inaturalist: "#22c55e",
  mushroom_observer: "#f59e0b",
  specieslink: "#60a5fa",
} as const;

function ObservationPopup({ obs }: { obs: IObservation }) {
  const { t, i18n } = useTranslation();
  const sourceName = t(`species_page.observations.source_${obs.source}`);
  const sourceColor = SOURCE_COLORS[obs.source] ?? "#6b7280";
  const formattedDate = obs.observed_on
    ? new Date(obs.observed_on + "T00:00:00").toLocaleDateString(i18n.language, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const qualityKey = obs.quality_grade
    ? `species_page.observations.quality_${obs.quality_grade}`
    : null;
  const qualityLabel = qualityKey && i18n.exists(qualityKey) ? t(qualityKey) : null;

  return (
    <Card className="w-[200px] overflow-hidden !border-0 outline-none bg-[#1c1f1c] text-white shadow-xl py-0 gap-0">
      {obs.photo_url && (
        <img src={obs.photo_url} alt="" className="h-28 w-full object-cover" loading="lazy" />
      )}
      <CardContent className="px-3 pt-1.5 pb-2 space-y-1">
        <p className="text-xs font-semibold" style={{ color: sourceColor }}>
          {sourceName}
        </p>
        <div className="space-y-0.5 text-[11px] text-white/55">
          {formattedDate && (
            <p>
              {t("species_page.observations.observed_on")}: {formattedDate}
            </p>
          )}
          {qualityLabel && <p>{qualityLabel}</p>}
          {obs.location_obscured && (
            <p className="italic">{t("species_page.observations.location_approximate")}</p>
          )}
        </div>
      </CardContent>
      {obs.url && obs.source !== "mushroom_observer" && (
        <CardFooter className="px-3 pb-2.5 pt-1">
          <a
            href={obs.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium hover:opacity-70 transition-opacity"
            style={{ color: sourceColor }}
          >
            {t("species_page.observations.view_on_source", { source: sourceName })} →
          </a>
        </CardFooter>
      )}
    </Card>
  );
}

interface ObservationMapCardProps {
  speciesId: number;
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
}

export function ObservationMapCard({
  speciesId,
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
}: ObservationMapCardProps) {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: speciesKeys.observations(speciesId),
    queryFn: ({ signal }) => fetchSpeciesObservations(speciesId, signal),
    enabled: !!speciesId,
    staleTime: 1000 * 60 * 30,
  });

  const observations = data?.observations ?? [];
  const total = data?.total ?? 0;

  if (!isLoading && total === 0) return null;

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <MapPin className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.observations.title")}</p>
          {!isLoading && <span className="text-sm text-white/40">· {total}</span>}
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="relative z-0 h-80 w-full overflow-hidden rounded-xl">
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <FitBounds observations={observations} />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                {observations.map((obs) => (
                  <CircleMarker
                    key={obs.id}
                    center={[obs.latitude, obs.longitude]}
                    radius={5}
                    pathOptions={{
                      color: SOURCE_COLORS[obs.source] ?? "#6b7280",
                      fillColor: SOURCE_COLORS[obs.source] ?? "#6b7280",
                      fillOpacity: 0.75,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <ObservationPopup obs={obs} />
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>

            <div className="mt-1.5 flex items-center gap-4 text-xs text-white/40">
              {Object.entries(SOURCE_COLORS).map(([source, color]) => (
                <span key={source} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {t(`species_page.observations.source_${source}`)}
                </span>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
