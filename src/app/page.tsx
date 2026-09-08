import { BrowserLocaleRedirect } from "@/components/BrowserLocaleRedirect";

/**
 * A static export runs no middleware, so `/` chooses a locale in the browser
 * after hydration.
 */
export default function RootPage() {
  return <BrowserLocaleRedirect />;
}
