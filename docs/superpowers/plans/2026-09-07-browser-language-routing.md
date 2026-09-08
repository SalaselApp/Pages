# Browser Language Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Direct static-site root visitors to the Arabic or English locale matching their browser preferences.

**Architecture:** A pure locale helper selects the first supported primary language from browser preferences. A small root-only client component calls that helper after hydration and replaces `/` with its locale route; all explicit locale routes remain unchanged.

**Tech Stack:** Next.js 16.3.1 static export, React 19.2.8, TypeScript 5, Vitest 5.

## Global Constraints

- Keep `output: "export"`; use no request headers, middleware, cookies, storage, API routes, or server-only behavior.
- Generate and preserve `/ar/` and `/en/` as explicit static routes.
- Browser detection runs only at `/`; direct locale URLs must never be overridden.
- Select `ar` or `en` from the first matching browser preference; default to `ar`.
- Use browser APIs only in a client component effect.
- Do not commit, push, or deploy unless user explicitly requests it.

---

### Task 1: Add tested browser locale selection and root redirect

**Files:**
- Create: `src/i18n/browser-locale.ts`
- Create: `src/i18n/browser-locale.test.ts`
- Create: `src/components/BrowserLocaleRedirect.tsx`
- Modify: `src/app/page.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `selectBrowserLocale(languages: readonly string[] | undefined): AppLocale`
- Consumes: `routing.locales` and `routing.defaultLocale` from `src/i18n/routing.ts`.
- Produces: `<BrowserLocaleRedirect />`, root-only client component that navigates with `window.location.replace`.

- [ ] **Step 1: Add test command and Vitest**

Run:

```bash
npm install --save-dev vitest@5.0.0
npm pkg set scripts.test='vitest run'
```

- [ ] **Step 2: Write failing locale-selection tests**

```ts
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
```

- [ ] **Step 3: Verify tests fail for missing helper**

Run: `npm test -- src/i18n/browser-locale.test.ts`

Expected: FAIL because `./browser-locale` cannot be resolved.

- [ ] **Step 4: Implement smallest helper and root client component**

```ts
export function selectBrowserLocale(
  languages: readonly string[] | undefined,
): AppLocale {
  for (const language of languages ?? []) {
    const locale = language.toLowerCase().split("-")[0];
    if (routing.locales.includes(locale as AppLocale)) return locale as AppLocale;
  }
  return routing.defaultLocale;
}
```

```tsx
"use client";

useEffect(() => {
  window.location.replace(`/${selectBrowserLocale(navigator.languages)}/`);
}, []);
```

Replace `src/app/page.tsx` server redirect with `<BrowserLocaleRedirect />`.

- [ ] **Step 5: Verify test suite, lint, and static export**

Run:

```bash
npm test
npm run lint
npm run build
test -f out/ar/index.html && test -f out/en/index.html
```

Expected: all commands exit 0 and both locale HTML files exist.
