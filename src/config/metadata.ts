import type { Metadata } from "next";

/** Static, absolute share URLs must point at the marketing site, not the app. */
export function shareMetadata(
  title: string,
  description: string,
  locale: string,
): Metadata {
  return {
    metadataBase: new URL("https://pages.salasel.app"),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Salasel",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images: [{
        url: "/og-share.jpg",
        width: 1200,
        height: 630,
        alt: "سلاسل / Salasel",
        type: "image/jpeg",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-share.jpg"],
    },
  };
}
