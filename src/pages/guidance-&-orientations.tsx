import { useTranslation } from "react-i18next";

export default function GuidancePage() {
  const { t } = useTranslation();

  return (
    <main className="container mx-auto px-4 py-16 text-white">
      <h1 className="text-[50px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] mb-12">
        {t("guidance.title")}
      </h1>

      <section className="mb-16 space-y-6">
        <p className="text-lg leading-relaxed">{t("guidance.intro.text1")}</p>
      </section>

      <section className="mb-16">
        <h2 className="mt-12 text-[34px] xl:text-[30px] font-semibold leading-[38px] xl:leading-[54px] mb-12">
          {t("guidance.principles.title")}
        </h2>
        <ul className="space-y-4 list-disc list-inside">
          <li className="text-lg leading-relaxed">{t("guidance.principles.item1")}</li>
          <li className="text-lg leading-relaxed">{t("guidance.principles.item2")}</li>
          <li className="text-lg leading-relaxed">{t("guidance.principles.item3")}</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4 uppercase tracking-wide">
          {t("guidance.section_guidance_title")}
        </h2>
        <div className="h-1 w-12 bg-[#00c000] rounded-full" />
        <div className="space-y-12 mt-8">
          <div className="pb-12 space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-medium whitespace-nowrap text-white">
                {t("guidance.sec1.title")}
              </h3>
              <div className="h-[1px] w-full bg-white/40" />
            </div>
            <div className="space-y-2 text-lg pl-3 leading-relaxed">
              <p>{t("guidance.sec1.intro")}</p>
              <p>{t("guidance.sec1.text1")}</p>
              <ul className="list-disc pl-5 space-y-3 text-lg leading-relaxed">
                <li>{t("guidance.sec1.text2")}</li>
                <li>{t("guidance.sec1.text3")}</li>
                <li>{t("guidance.sec1.text4")}</li>
                <li>{t("guidance.sec1.text5")}</li>
              </ul>
            </div>
          </div>

          <div className="pb-12 space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-medium whitespace-nowrap text-white">
                {t("guidance.sec2.title")}
              </h3>
              <div className="h-[1px] w-full bg-white/40" />
            </div>

            <div className="space-y-2 text-lg pl-3 leading-relaxed">
              <p>{t("guidance.sec2.intro")}</p>

              <div className="space-y-6 pl-4">
                <div>
                  <h4 className="font-medium mb-2">{t("guidance.sec2.obs_title")}</h4>
                  <ul className="list-disc pl-5 space-y-2 text-lg leading-relaxed">
                    <li>{t("guidance.sec2.obs1")}</li>
                    <li>{t("guidance.sec2.obs2")}</li>
                    <li>{t("guidance.sec2.obs3")}</li>
                    <li>{t("guidance.sec2.obs4")}</li>
                    <li>{t("guidance.sec2.obs5")}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("guidance.sec2.photo_title")}</h4>
                  <ul className="list-disc pl-5 space-y-2 text-lg leading-relaxed">
                    <li>{t("guidance.sec2.photo1")}</li>
                    <li>{t("guidance.sec2.photo2")}</li>
                    <li>{t("guidance.sec2.photo3")}</li>
                    <li className="italic">{t("guidance.sec2.photo4")}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("guidance.sec2.bio_title")}</h4>
                  <div className="space-y-2 text-lg leading-relaxed">
                    <p>{t("guidance.sec2.bio1")}</p>
                    <p>{t("guidance.sec2.bio2")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-12 space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-medium whitespace-nowrap text-white">
                {t("guidance.sec3.title")}
              </h3>
              <div className="h-[1px] w-full bg-white/40" />
            </div>

            <div className="space-y-2 text-lg pl-3 leading-relaxed">
              <p>{t("guidance.sec3.text1")}</p>
              <p>{t("guidance.sec3.text2")}</p>
              <p>{t("guidance.sec3.text3")}</p>
            </div>
          </div>

          <div className="pb-12 space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-medium whitespace-nowrap text-white">
                {t("guidance.sec4.title")}
              </h3>
              <div className="h-[1px] w-full bg-white/40" />
            </div>

            <div className="space-y-2 text-lg pl-3 leading-relaxed">
              <p>{t("guidance.sec4.intro")}</p>

              <div className="space-y-6 pl-4">
                <div>
                  <h4 className="font-medium mb-2">{t("guidance.sec4.hab_title")}</h4>
                  <p className="mb-2 text-lg leading-relaxed">{t("guidance.sec4.hab_desc")}</p>
                  <ul className="list-decimal pl-5 space-y-2 text-lg leading-relaxed">
                    <li>{t("guidance.sec4.hab1")}</li>
                    <li>{t("guidance.sec4.hab2")}</li>
                    <li>{t("guidance.sec4.hab3")}</li>
                  </ul>
                  <p className="italic mt-2">{t("guidance.sec4.hab4")}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("guidance.sec4.alt_title")}</h4>
                  <div className="space-y-2 text-lg leading-relaxed">
                    <p>{t("guidance.sec4.alt1")}</p>
                    <p>{t("guidance.sec4.alt2")}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("guidance.sec4.host_title")}</h4>
                  <div className="space-y-2 text-lg leading-relaxed">
                    <p>{t("guidance.sec4.host1")}</p>
                    <p className="italic">{t("guidance.sec4.host2")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-12 space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-medium whitespace-nowrap text-white">
                {t("guidance.sec5.title")}
              </h3>
              <div className="h-[1px] w-full bg-white/40" />
            </div>
            <div className="space-y-2 text-lg pl-3 leading-relaxed">
              <p>{t("guidance.sec5.intro")}</p>
              <p>{t("guidance.sec5.text1")}</p>
              <ul className="list-disc pl-5 space-y-3 text-lg leading-relaxed">
                <li>{t("guidance.sec5.text2")}</li>
                <li>{t("guidance.sec5.text3")}</li>
                <li>{t("guidance.sec5.text4")}</li>
              </ul>
            </div>
          </div>

          <div className="pb-12 space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-medium whitespace-nowrap text-white">
                {t("guidance.sec6.title")}
              </h3>
              <div className="h-[1px] w-full bg-white/40" />
            </div>

            <div className="space-y-2 text-lg pl-3 leading-relaxed">
              <p>{t("guidance.sec6.text1")}</p>
              <p>{t("guidance.sec6.text2")}</p>
              <p>{t("guidance.sec6.text3")}</p>
            </div>
          </div>

          <div className="pb-12 space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-medium whitespace-nowrap text-white">
                {t("guidance.sec7.title")}
              </h3>
              <div className="h-[1px] w-full bg-white/40" />
            </div>

            <div className="space-y-2 text-lg pl-3 leading-relaxed">
              <p>{t("guidance.sec7.text1")}</p>
              <p>{t("guidance.sec7.text2")}</p>
              <p>{t("guidance.sec7.text3")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-8">
        <div className="mb-14">
          <h2 className="text-3xl font-medium text-white mb-4">
            {t("guidance.photo_guide.title")}
          </h2>
          <div className="h-1 w-12 bg-[#00c000] rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          <div>
            <h4 className="text-xl text-white mb-5 uppercase tracking-wider">
              {t("guidance.photo_guide.cam_title")}
            </h4>
            <ul className="list-disc pl-4 space-y-3 text-white text-lg leading-relaxed">
              <li>{t("guidance.photo_guide.cam1")}</li>
              <li>{t("guidance.photo_guide.cam2")}</li>
              <li>{t("guidance.photo_guide.cam3")}</li>
              <li>{t("guidance.photo_guide.cam4")}</li>
              <li>{t("guidance.photo_guide.cam5")}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl text-white mb-5 uppercase tracking-wider">
              {t("guidance.photo_guide.prot_title")}
            </h4>
            <ul className="list-disc pl-4 space-y-3 text-white text-lg leading-relaxed">
              <li>{t("guidance.photo_guide.prot1")}</li>
              <li>{t("guidance.photo_guide.prot2")}</li>
              <li>{t("guidance.photo_guide.prot3")}</li>
              <li>{t("guidance.photo_guide.prot4")}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl text-white mb-5 uppercase tracking-wider">
              {t("guidance.photo_guide.meta_title")}
            </h4>
            <ul className="list-disc pl-4 space-y-3 text-white text-lg leading-relaxed">
              <li>{t("guidance.photo_guide.meta1")}</li>
              <li>{t("guidance.photo_guide.meta2")}</li>
              <li>{t("guidance.photo_guide.meta3")}</li>
              <li>{t("guidance.photo_guide.meta4")}</li>
              <li>{t("guidance.photo_guide.meta5")}</li>
              <li>{t("guidance.photo_guide.meta6")}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl text-white mb-5 uppercase tracking-wider">
              {t("guidance.photo_guide.ethics_title")}
            </h4>
            <ul className="list-disc pl-4 space-y-3 text-white text-lg leading-relaxed">
              <li>{t("guidance.photo_guide.ethics1")}</li>
              <li>{t("guidance.photo_guide.ethics2")}</li>
              <li>{t("guidance.photo_guide.ethics3")}</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
