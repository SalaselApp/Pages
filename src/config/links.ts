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
  /** Source repository. */
  source: {
    href: "#source",
    pending: true,
    external: true,
  },
  /** Extension privacy policy. Intended final path is `/extension/privacy`. */
  extensionPrivacy: {
    href: "#privacy",
    pending: true,
  },
} satisfies Record<string, Destination>;
