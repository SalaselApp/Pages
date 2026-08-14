import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * A static export runs no middleware, so `/` cannot negotiate a locale. It
 * redirects to the default locale instead, which Next.js emits as a static
 * redirect at build time.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
