import Image from "next/image";
import { getTranslations } from "next-intl/server";

/**
 * Brand lockup: the Salasel chain mark followed by the wordmark as text.
 *
 * The navbar uses the vector form of the mark (`logo.svg`) so it stays crisp at
 * any size. It is a faithful multi-colour trace of `logo.png` (same chain
 * artwork, transparent background), so raster and vector stay in sync. The
 * raster `logo.png` remains the source for larger/product surfaces and the
 * favicon.
 */
export async function Brand() {
  const t = await getTranslations("brand");

  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/images/landing/brand/logo.svg"
        alt=""
        aria-hidden="true"
        width={36}
        height={36}
        priority
        className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
      />
      <span className="text-cream text-lg font-semibold tracking-tight sm:text-xl">
        {t("name")}
      </span>
    </span>
  );
}
