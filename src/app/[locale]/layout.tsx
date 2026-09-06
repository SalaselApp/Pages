import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeDirection, routing, type AppLocale } from "@/i18n/routing";
import "../globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const latin = Inter({
  variable: "--font-latin",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LayoutProps<"/[locale]">, "children">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale: locale as AppLocale,
    namespace: "metadata",
  });

  const title = t("title");
  const description = t("description");
  // Absolute base for OG/Twitter asset URLs. Set `NEXT_PUBLIC_SITE_URL` to the
  // production origin; falls back to the known site so previews still resolve.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://salasel.app";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Salasel",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      // 1:1 share card built from the brand mark on the hero's navy glow.
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 1200,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Opts every child Server Component into static rendering, which the static
  // export requires.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={`${arabic.variable} ${latin.variable} h-full antialiased`}
    >
      <body className="bg-canvas text-cream flex min-h-full flex-col">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
