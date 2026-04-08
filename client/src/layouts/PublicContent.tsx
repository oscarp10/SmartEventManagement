import type { ReactNode } from "react";

/** Inner width + vertical rhythm for marketing pages (home, about, contact, support). */
export function PublicContent({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl space-y-6">{children}</div>;
}
