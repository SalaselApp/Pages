import { describe, expect, it } from "vitest";
import { selectBrowserLocale } from "./browser-locale";

describe("selectBrowserLocale", () => {
  it("uses first supported browser language", () => {
    expect(selectBrowserLocale(["fr-FR", "en-US", "ar-SA"])).toBe("en");
  });

  it("matches regional Arabic language tags", () => {
    expect(selectBrowserLocale(["ar-SA"])).toBe("ar");
  });

  it("falls back to Arabic for unsupported or absent preferences", () => {
    expect(selectBrowserLocale(["ja-JP", "fr"])).toBe("ar");
    expect(selectBrowserLocale(undefined)).toBe("ar");
  });
});
