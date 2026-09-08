# Browser language routing design

## Goal

Send first-time visitors who open the static site root (`/`) to the Arabic or English locale matching their browser preference.

## Scope

- Detection runs only on `/`.
- `/ar/` and `/en/` remain explicit, stable links and are never overridden.
- Supported browser language tags are `ar` and `en`, including regional variants such as `ar-SA` and `en-US`.
- When no supported preference is available, use Arabic, the existing default locale.

## Architecture

Replace root server redirect with a focused client component. On mount, it reads `navigator.languages` (falling back to `navigator.language`), selects the first supported primary language tag, then calls `window.location.replace` for that locale route. Using browser APIs inside an effect keeps the page compatible with Next.js static export; using `replace` prevents the root redirect page from becoming a Back-button stop.

Locale route rendering, static locale generation, translations, direction, and the existing language switcher remain unchanged.

## Error handling

Browser APIs are accessed only after hydration. Missing or malformed browser-language values fall back to `ar`; no network, cookies, storage, middleware, or server request headers are used.

## Testing

Extract locale selection into a pure helper. Unit tests cover first supported preference, regional tags, unsupported-language fallback, and an empty preference list. Build verifies Next.js still emits static output.
