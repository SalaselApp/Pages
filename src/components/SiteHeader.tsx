import { getTranslations } from "next-intl/server";
import { Brand } from "@/components/Brand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

/**
 * Minimal top bar: brand lockup on the start side, language control on the end.
 *
 * Deliberately just these two things for now, with room to grow later. No
 * background, no border, no boxed header.
 */
export async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="relative z-20 w-full">
      <div className="mx-auto flex w-full max-w-[86rem] items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:py-6">
        <Brand />
        <LanguageSwitcher label={t("languageLabel")} />
      </div>
    </header>
  );
}
