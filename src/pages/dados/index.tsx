import { useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchSnapshotDownloadUrl } from "@/api/snapshot";
import { DEFAULT_LOCALE } from "@/lib/lang";

const VERSIONS = [{ value: "latest", label: "dados_page.version_latest" }];

export default function DadosPage() {
  const { t } = useTranslation();
  const { lang: urlLang } = useParams();
  const [format, setFormat] = useState<"xlsx" | "json">("xlsx");
  const [lang, setLang] = useState<"pt" | "en">((urlLang ?? DEFAULT_LOCALE) === "pt" ? "pt" : "en");
  const [version, setVersion] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleDownload() {
    setLoading(true);
    setError(false);
    try {
      const versionParam = version === "latest" ? undefined : Number(version);
      const data = await fetchSnapshotDownloadUrl(lang, format, versionParam);
      const url = import.meta.env.PROD ? data.url.replace(/^http:\/\//i, "https://") : data.url;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `lumm_v${data.version}_${data.lang}.${data.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 my-10 text-white">
      <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] mb-8">
        {t("dados_page.title")}
      </h1>
      <p className="text-[18px] mb-10 max-w-2xl">{t("dados_page.description")}</p>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("dados_page.version_label")}</label>
          <Select value={version} onValueChange={setVersion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VERSIONS.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {t(v.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("dados_page.lang_label")}</label>
          <Select value={lang} onValueChange={(v) => setLang(v as "pt" | "en")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">{t("dados_page.lang_pt")}</SelectItem>
              <SelectItem value="en">{t("dados_page.lang_en")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("dados_page.format_label")}</label>
          <Select value={format} onValueChange={(v) => setFormat(v as "xlsx" | "json")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="json">JSON (.json)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={loading}
          onClick={handleDownload}
          className="bg-primary text-black font-semibold hover:bg-primary/90"
        >
          {loading ? t("dados_page.downloading") : t("dados_page.download_cta")}
        </Button>
      </div>
      {error && <p className="mt-4 text-red-400 text-sm">{t("dados_page.error")}</p>}
    </div>
  );
}
