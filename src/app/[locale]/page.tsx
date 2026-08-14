import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { Hero } from "@/components/hero/Hero";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <>
      <a
        href="#main"
        className="bg-canvas-raised text-cream border-hairline-strong sr-only rounded-full border px-5 py-3 focus-visible:not-sr-only focus-visible:absolute focus-visible:start-6 focus-visible:top-6 focus-visible:z-50"
      >
        {t("skipToContent")}
      </a>
      <main id="main" className="flex flex-1 flex-col">
        <Hero />
      </main>
    </>
  );
}
