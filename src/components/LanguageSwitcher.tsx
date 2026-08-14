"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeLabel, routing, type AppLocale } from "@/i18n/routing";

/**
 * Switches locale while staying on the equivalent page.
 *
 * `usePathname` from next-intl returns the pathname without its locale prefix,
 * so the same value can be re-rendered under the other locale. This is a plain
 * link, so it works with keyboard navigation and without JavaScript once
 * hydrated markup is in place.
 */
export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const other = routing.locales.find((candidate) => candidate !== locale)!;

  return (
    <Link
      href={pathname}
      locale={other}
      lang={other}
      hrefLang={other}
      aria-label={`${label}: ${localeLabel[other]}`}
      className="border-hairline text-cream-dim hover:border-hairline-strong hover:text-cream inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm transition-colors duration-200"
    >
      {localeLabel[other]}
    </Link>
  );
}
