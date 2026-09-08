import { BrowserLocaleRedirect } from "@/components/BrowserLocaleRedirect";
import { shareMetadata } from "@/config/metadata";
import messages from "@/messages/ar.json";

// Crawlers receive metadata in static HTML before the browser locale redirect.
export const metadata = shareMetadata(
  messages.metadata.title,
  messages.metadata.description,
  "ar",
);

/**
 * A static export runs no middleware, so `/` chooses a locale in the browser
 * after hydration.
 */
export default function RootPage() {
  return <BrowserLocaleRedirect />;
}
