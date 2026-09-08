/**
 * Outbound destinations, kept in one place so CTAs can be repointed without
 * touching section markup.
 *
 * `pending: true` marks a destination that is NOT final. Each one is reported
 * in the handoff notes rather than invented here.
 */
export type Destination = {
  href: string;
  pending: boolean;
  /** Set when the link leaves this site. */
  external?: boolean;
};

export const links = {
  /**
   * The Salasel web app. Read from `NEXT_PUBLIC_APP_URL` (inlined at build time
   * for the static export) so it can be repointed without touching markup;
   * falls back to the known production URL. A real, published destination, so
   * it is not pending and opens in a new tab.
   */
  app: {
    href: process.env.NEXT_PUBLIC_APP_URL ?? "https://salasel.app/",
    pending: false,
    external: true,
  },
  /**
   * Chrome Web Store listing. Uses the supplied listing as the default, with
   * an optional build-time `NEXT_PUBLIC_EXTENSION_URL` override.
   */
  extension: {
    href:
      process.env.NEXT_PUBLIC_EXTENSION_URL ??
      "https://chromewebstore.google.com/detail/jpbdellidndlbbmhkipejbjpgfgekneo",
    pending: false,
    external: true,
  },
  /**
   * Source repository. Read from `NEXT_PUBLIC_SOURCE_URL` (inlined at build
   * time for the static export) so the destination can be repointed without
   * touching markup; falls back to an in-page anchor when unset. The
   * GitHub org home is a real, published destination, so this is not pending.
   */
  source: {
    href: process.env.NEXT_PUBLIC_SOURCE_URL ?? "#source",
    pending: !process.env.NEXT_PUBLIC_SOURCE_URL,
    external: true,
  },
  /**
   * App privacy policy. A real in-site page at `/{locale}/privacy`, so the
   * locale prefix is added at render time from the active locale.
   */
  appPrivacy: {
    href: "/privacy",
    pending: false,
  },
  /**
   * Extension privacy policy — the stable URL Chrome Web Store submission
   * requires. A real in-site page at `/{locale}/extension/privacy`.
   */
  extensionPrivacy: {
    href: "/extension/privacy",
    pending: false,
  },
  /**
   * Feedback/contact. Points at the pending Section 9 feedback form anchor
   * (`#feedback`) until that section lands.
   */
  feedback: {
    href: "#feedback",
    pending: true,
  },
} satisfies Record<string, Destination>;
