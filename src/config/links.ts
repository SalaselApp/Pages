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
  /** The Salasel web app. Final production URL still unconfirmed. */
  app: {
    href: "#salasel-app",
    pending: true,
  },
  /**
   * Chrome Web Store listing. The extension is unpublished, so this stays an
   * in-page anchor instead of a fabricated store URL.
   */
  extension: {
    href: "#chrome-extension",
    pending: true,
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
