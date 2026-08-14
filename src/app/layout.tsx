/**
 * The real document shell lives in `src/app/[locale]/layout.tsx`, where `lang`
 * and `dir` can be resolved per locale. This root layout exists only so the
 * redirecting `/` route has a parent, and must not render a second `<html>`.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
