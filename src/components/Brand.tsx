import Image from "next/image";
import { getTranslations } from "next-intl/server";

/**
 * Brand lockup: the Salasel mark followed by the wordmark as real text.
 *
 * `logo.png` is a 1200x1200 canvas whose art occupies x 146-908, y 184-1047,
 * so it is not centered. Those measured bounds are used to crop it optically
 * with CSS, keeping the mark visually aligned with the text baseline without
 * touching the asset.
 */

const ASSET = { width: 1200, height: 1200 } as const;
const ART = { left: 146, top: 184, width: 763, height: 864 } as const;

export async function Brand() {
  const t = await getTranslations("brand");

  return (
    <span className="flex items-center gap-2.5">
      <span
        className="relative block h-8 shrink-0 overflow-hidden sm:h-9"
        style={{ aspectRatio: `${ART.width} / ${ART.height}` }}
      >
        <Image
          src="/images/landing/brand/logo.png"
          alt=""
          aria-hidden="true"
          width={ASSET.width}
          height={ASSET.height}
          priority
          sizes="36px"
          className="absolute max-w-none"
          style={{
            width: `${(ASSET.width / ART.width) * 100}%`,
            height: `${(ASSET.height / ART.height) * 100}%`,
            left: `${(ART.left / ART.width) * -100}%`,
            top: `${(ART.top / ART.height) * -100}%`,
          }}
        />
      </span>
      <span className="text-cream text-lg font-semibold tracking-tight sm:text-xl">
        {t("name")}
      </span>
    </span>
  );
}
