import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { routing, type AppLocale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as AppLocale,
    namespace: "legal.appPrivacy",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AppPrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("legal.appPrivacy");

  const keys = [
    "noAccount",
    "onDevice",
    "feedback",
    "openSource",
    "changes",
  ] as const;

  const sections: LegalSection[] = keys.map((key) => ({
    title: t(`sections.${key}.title`),
    body: t(`sections.${key}.body`),
  }));

  return (
    <LegalPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      sections={sections}
    />
  );
}
