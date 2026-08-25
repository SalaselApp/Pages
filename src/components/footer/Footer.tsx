import { getTranslations } from "next-intl/server";
import { Brand } from "@/components/Brand";
import { Link } from "@/i18n/navigation";
import { links, type Destination } from "@/config/links";

/**
 * Section 10 — Footer.
 *
 * The page's closing band, built to the comp (`10-footer.png`): the brand
 * lockup and a one-sentence mission sit on the reading-start edge, and the
 * site's remaining destinations are gathered into three small link groups on
 * the reading-end edge. A single hairline rule separates the footer from the
 * section above it, matching the comp's quiet divider; there is no boxed
 * container, no card, and — per spec — no generic copyright line.
 *
 * This is a fully static band: no entrance animation and no client code. The
 * link groups map onto the spec's required footer contents:
 *
 *   - Product — the two product paths (app / extension).
 *   - Privacy — the App and Extension privacy policies. These are real in-site
 *     pages; the Extension policy is the stable URL Chrome Web Store submission
 *     requires.
 *   - Openness — the open-source repository.
 *
 * Every destination flows through `@/config/links`, so the whole footer
 * repoints from one place. Internal routes (the privacy pages) use next-intl's
 * `Link`, which adds the active locale prefix and keeps language switching on
 * the equivalent page; external destinations get a proper `target`/`rel`.
 *
 * Layout is logical and mirrors per locale automatically: brand column on the
 * reading-start edge, link groups on the reading-end edge, using `grid`,
 * logical gaps, and text alignment rather than any physical left/right. Below
 * `lg` the brand block stacks above the link groups in reading order.
 */

/** One footer link, resolved against a `links` destination. */
type FooterLink = {
  label: string;
  destination: Destination;
  /** Internal in-site route (uses the locale-aware `Link`). */
  internal?: boolean;
};

/** One footer link group: a small heading and its links. */
type FooterGroup = {
  title: string;
  links: FooterLink[];
};

export async function Footer() {
  const t = await getTranslations("footer");

  const groups: FooterGroup[] = [
    {
      title: t("groups.product.title"),
      links: [
        { label: t("groups.product.links.app"), destination: links.app },
        {
          label: t("groups.product.links.extension"),
          destination: links.extension,
        },
      ],
    },
    {
      title: t("groups.privacy.title"),
      links: [
        {
          label: t("groups.privacy.links.app"),
          destination: links.appPrivacy,
          internal: true,
        },
        {
          label: t("groups.privacy.links.extension"),
          destination: links.extensionPrivacy,
          internal: true,
        },
      ],
    },
    {
      title: t("groups.openness.title"),
      links: [
        {
          label: t("groups.openness.links.source"),
          destination: links.source,
        },
      ],
    },
  ];

  return (
    <footer
      aria-labelledby="footer-heading"
      /*
        Continues the dark palette. A single top hairline rule separates the
        footer from the section above it — the comp's only divider — so the band
        reads as a quiet close rather than a boxed region.
      */
      className="bg-canvas text-cream border-hairline w-full border-t"
    >
      <h2 id="footer-heading" className="sr-only">
        {t("navLabel")}
      </h2>

      <div className="mx-auto grid w-full max-w-[86rem] grid-cols-1 gap-x-16 gap-y-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-x-24">
        {/* Brand column: the lockup and a one-sentence mission. */}
        <div className="flex max-w-sm flex-col gap-4">
          <Brand />
          <p className="text-cream-dim text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed text-balance">
            {t("mission")}
          </p>
        </div>

        {/* Link groups on the reading-end edge. Wrap comfortably on small
            viewports, sit in a row from `sm` up. */}
        <nav
          aria-label={t("navLabel")}
          className="grid grid-cols-2 gap-x-12 gap-y-10 sm:flex sm:gap-x-16"
        >
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3 className="text-cream-faint text-xs font-medium tracking-[0.16em] uppercase">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem
                      destination={link.destination}
                      label={link.label}
                      internal={link.internal}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}

const LINK_CLASS =
  "text-cream-dim hover:text-cream inline-flex min-h-11 items-center text-[0.9375rem] transition-colors duration-200";

/**
 * One footer link.
 *
 * Internal destinations use next-intl's `Link` so the active locale prefix is
 * added and language switching stays on the equivalent page. External
 * destinations open in a new tab with a safe `rel`; in-page hash links are
 * plain anchors.
 */
function FooterLinkItem({
  destination,
  label,
  internal,
}: {
  destination: Destination;
  label: string;
  internal?: boolean;
}) {
  if (internal) {
    return (
      <Link href={destination.href} className={LINK_CLASS}>
        {label}
      </Link>
    );
  }

  return (
    <a
      href={destination.href}
      {...(destination.external
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
      className={LINK_CLASS}
    >
      {label}
    </a>
  );
}
