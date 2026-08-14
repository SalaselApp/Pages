import { defineRouting } from "next-intl/routing";

/**
 * Arabic is the primary visual language, so it is the default locale.
 *
 * A static export never runs middleware, so `localePrefix: "always"` and
 * `localeDetection: false` are the only supported combination: the locale has
 * to be readable from the URL alone.
 */
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

export const localeDirection: Record<AppLocale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export const localeLabel: Record<AppLocale, string> = {
  ar: "العربية",
  en: "English",
};
