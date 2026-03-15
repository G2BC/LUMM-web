import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHOTO_LICENSE_OPTIONS } from "@/pages/species-request/constants";
import { useTranslation } from "react-i18next";

export type PhotoMetadataValues = {
  license_code: string;
  attribution: string;
  rights_holder: string;
  source_url: string;
  lumm: boolean;
  featured: boolean;
};

type PhotoMetadataFieldsProps = {
  values: PhotoMetadataValues;
  onChange: (_field: keyof PhotoMetadataValues, _value: string | boolean) => void;
  onFeaturedChange?: (_checked: boolean) => void;
};

export function PhotoMetadataFields({
  values,
  onChange,
  onFeaturedChange,
}: PhotoMetadataFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            {t("species_request.photo_license")}
          </label>
          <Select
            value={values.license_code}
            onValueChange={(value) => onChange("license_code", value)}
          >
            <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 data-[placeholder]:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200">
              <SelectValue placeholder={t("species_request.photo_license_placeholder")} />
            </SelectTrigger>
            <SelectContent className="bg-white text-slate-900">
              {PHOTO_LICENSE_OPTIONS.map((value) => (
                <SelectItem key={value} value={value} className="text-slate-900">
                  {value === "ALL-RIGHTS-RESERVED"
                    ? t("species_request.photo_license_arr")
                    : value.replace(/-/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            {t("species_request.photo_attribution")}
          </label>
          <Input
            value={values.attribution}
            onChange={(event) => onChange("attribution", event.target.value)}
            placeholder={t("species_request.photo_attribution_placeholder")}
            className="border-slate-300 bg-white text-slate-900 caret-slate-900 placeholder:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200 focus-within:border-slate-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            {t("species_request.photo_rights_holder")}
          </label>
          <Input
            value={values.rights_holder}
            onChange={(event) => onChange("rights_holder", event.target.value)}
            placeholder={t("species_request.photo_rights_holder_placeholder")}
            className="border-slate-300 bg-white text-slate-900 caret-slate-900 placeholder:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200 focus-within:border-slate-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            {t("species_request.photo_source_url")}
          </label>
          <Input
            type="url"
            value={values.source_url}
            onChange={(event) => onChange("source_url", event.target.value)}
            placeholder={t("species_request.photo_source_url_placeholder")}
            className="border-slate-300 bg-white text-slate-900 caret-slate-900 placeholder:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200 focus-within:border-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={values.lumm}
            onChange={(event) => onChange("lumm", event.target.checked)}
          />
          <span>{t("panel_page.species_photos_mark_lumm")}</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={values.featured}
            onChange={(event) => {
              const checked = event.target.checked;
              if (onFeaturedChange) {
                onFeaturedChange(checked);
                return;
              }
              onChange("featured", checked);
            }}
          />
          <span>{t("panel_page.species_photos_mark_featured")}</span>
        </label>
      </div>
    </>
  );
}
