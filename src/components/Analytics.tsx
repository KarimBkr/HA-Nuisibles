"use client";

import { useEffect } from "react";
import { analyticsConfig, eventForHref, track, type AnalyticsConfig } from "@/lib/analytics";

// Queue for events sent before the deferred script runs (Plausible's documented snippet).
const QUEUE = "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}";

export default function Analytics({ config = analyticsConfig() }: { config?: AnalyticsConfig | null }) {
  // One delegated listener for call and booking links; a no-op while window.plausible is absent.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const event = eventForHref((e.target as Element | null)?.closest?.("a")?.getAttribute("href") ?? null);
      if (event) track(event, { page: window.location.pathname });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!config) return null;
  return (
    <>
      <script defer data-domain={config.domain} src={config.src} />
      <script dangerouslySetInnerHTML={{ __html: QUEUE }} />
    </>
  );
}
