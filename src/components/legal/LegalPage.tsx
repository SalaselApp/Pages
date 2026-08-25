import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/footer/Footer";
import { Link } from "@/i18n/navigation";

/**
 * Shared layout for the legal / policy pages (App and Extension privacy).
 *
 * These are quiet, typography-led documents on the same dark canvas as the rest
 * of the site: the shared header and footer bookend a single centred reading
 * column of an eyebrow, title, intro, and a stack of titled sections. Content
 * is fully data-driven so each policy page just passes its own translated
 * sections in; there is no per-page layout code.
 *
 * Fully static — no animation, no client code beyond the shared header/footer
 * islands. Logical properties throughout, so it mirrors per locale.
 */

/** One policy section: a heading and a body paragraph. */
export type LegalSection = {
  title: string;
  body: string;
};

export async function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  const t = await getTranslations("legal");

  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="mx-auto flex w-full max-w-[48rem] flex-1 flex-col px-6 py-16 sm:px-10 sm:py-24"
      >
        <p className="text-teal-brand text-sm font-medium tracking-[0.16em] uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance">
          {title}
        </h1>
        <p className="text-cream-faint mt-3 text-sm">
          {t("lastUpdated")}: {t("lastUpdatedDate")}
        </p>

        <p className="text-cream-dim mt-8 text-[clamp(1.0625rem,1.7vw,1.1875rem)] leading-relaxed">
          {intro}
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-3">
              <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] font-semibold tracking-[-0.01em]">
                {section.title}
              </h2>
              <p className="text-cream-dim text-[clamp(1rem,1.5vw,1.0625rem)] leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <Link
          href="/"
          className="border-hairline-strong text-cream hover:bg-canvas-raised mt-16 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border px-5 py-3 text-base font-medium transition-colors duration-200"
        >
          {t("backToHome")}
        </Link>
      </main>
      <Footer />
    </>
  );
}
