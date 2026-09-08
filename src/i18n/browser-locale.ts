import { routing, type AppLocale } from "./routing";

export function selectBrowserLocale(
  languages: readonly string[] | undefined,
): AppLocale {
  for (const language of languages ?? []) {
    const locale = language.toLowerCase().split("-")[0];
    if (routing.locales.includes(locale as AppLocale)) return locale as AppLocale;
  }
  return routing.defaultLocale;
}
