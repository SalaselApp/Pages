"use client";

import { useEffect } from "react";
import { selectBrowserLocale } from "@/i18n/browser-locale";

export function BrowserLocaleRedirect() {
  useEffect(() => {
    const languages = navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    window.location.replace(`/${selectBrowserLocale(languages)}/`);
  }, []);

  return null;
}
