import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Static export: every route must be build-time renderable.
  output: "export",
  // The default image loader needs a server, which a static export has no room
  // for. Assets are already sized correctly for their slots.
  images: {
    unoptimized: true,
  },
  // Emits `/ar/index.html` instead of `/ar.html`, which static hosts resolve
  // more predictably for locale-prefixed directories.
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
