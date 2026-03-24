import { useTranslation } from "react-i18next";
import CollaboratorsSection from "./components/collaborators";
import ResearchGroupsSection from "./components/research_groups";

export default function ContributorsPage() {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto pt-10 px-4">
      <h2 className="text-[34px] xl:text-[50px] font-bold text-white">
        {t("collaborators_page.groups")}
      </h2>

      <ResearchGroupsSection />

      <h1 className="text-[34px] xl:text-[50px] font-bold text-white">
        {t("collaborators_page.team")}
      </h1>

      <CollaboratorsSection />
    </section>
  );
}
