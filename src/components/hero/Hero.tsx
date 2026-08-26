import { getTranslations } from "next-intl/server";
import { DecorativeNetwork } from "@/components/hero/DecorativeNetwork";
import { HeroMark } from "@/components/hero/HeroMark";
import { AppIcon, ExtensionIcon } from "@/components/hero/ProductIcons";
import { ProductPath } from "@/components/hero/ProductPath";
import { SiteHeader } from "@/components/SiteHeader";
import { links } from "@/config/links";

/**
 * Hero: one identity, two equal product choices.
 *
 * Desktop follows the approved comp hierarchy (minimal top bar, large glowing
 * mark above an Arabic-primary headline, then two side-by-side product paths).
 * Mobile is an intentional adaptation rather than a squeezed desktop scene.
 */
export async function Hero() {
  const t = await getTranslations("hero");
  // The rotating headline speaks the hadith one clause at a time, in reading
  // order. Each clause splits into a lead and its final word, so the final word
  // can take the theme's teal accent. Kept as an ordered list so the source
  // sentence stays obvious here.
  const phrases = [
    { lead: t("phases.one.lead"), last: t("phases.one.last") },
    { lead: t("phases.two.lead"), last: t("phases.two.last") },
    { lead: t("phases.three.lead"), last: t("phases.three.last") },
  ];

  // `min-h-svh` plus a column layout makes the hero one self-contained screen:
  // the header pins to the top, the content column takes the remaining space,
  // and the product paths sit at the bottom without needing a scroll. `svh`
  // rather than `vh` so mobile browser chrome does not push the paths off.
  // Gaps are `vh`-proportional so the scene compresses on short viewports
  // instead of overflowing.
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* Decorative layers, all kept off the interaction layer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(47,143,107,0.20),transparent_62%)]" />
        <DecorativeNetwork />
      </div>

      <SiteHeader />

      <div className="mx-auto flex w-full max-w-[86rem] flex-1 flex-col items-center justify-center gap-[2vh] px-6 pt-[1vh] pb-[2vh] sm:gap-[3vh] sm:px-10">
        {/* Glowing Salasel mark. Not lazy-loaded: it is the primary hero mark. */}
        <div className="rise">
          <HeroMark />
        </div>

        <div className="flex w-full max-w-4xl flex-col items-center gap-3 text-center sm:gap-4">
          {/*
            The one meaningful h1 on the page. It cycles through the three
            clauses of the hadith with a pure-CSS rotator, so it renders without
            JavaScript. Assistive tech reads the full hadith once via the
            visually-hidden line; the rotating clauses are hidden from a11y so a
            screen reader never hears the sentence broken into fragments.
          */}
          <h1
            className="rise text-cream text-[clamp(1.75rem,5vw,3.25rem)] leading-[1.2] font-semibold tracking-[-0.01em] text-balance"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="hero-phrase-sr">{t("hadith")}</span>
            <span className="hero-phrases" aria-hidden="true">
              {phrases.map((phrase, i) => (
                <span key={i} className={`hero-phrase hero-phrase-${i + 1}`}>
                  {phrase.lead}{" "}
                  <span className="text-teal-brand">{phrase.last}</span>
                </span>
              ))}
            </span>
          </h1>

          {/*
            The Salasel tagline in the page's own language, deliberately
            smaller: the steady line the rotating hadith resolves into.
          */}
          <p
            className="rise text-cream-dim text-[clamp(0.95rem,2vw,1.25rem)] leading-relaxed"
            style={{ animationDelay: "0.16s" }}
          >
            {t("tagline")}
          </p>
        </div>

        {/* Two equal paths: side by side from `md` up, stacked full-width below. */}
        <div
          className="rise w-full max-w-4xl"
          style={{ animationDelay: "0.24s" }}
        >
          <h2 className="sr-only">{t("choicesLabel")}</h2>
          {/* `items-stretch` so both panels adopt the tallest row height. */}
          <div className="grid w-full grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:gap-5">
            <ProductPath
              accent="teal"
              eyebrow={t("app.eyebrow")}
              title={t("app.title")}
              cta={t("app.cta")}
              destination={links.app}
              icon={<AppIcon className="size-11 sm:size-12" />}
            />
            <ProductPath
              accent="lime"
              eyebrow={t("extension.eyebrow")}
              title={t("extension.title")}
              cta={t("extension.cta")}
              destination={links.extension}
              icon={<ExtensionIcon className="size-11 sm:size-12" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
