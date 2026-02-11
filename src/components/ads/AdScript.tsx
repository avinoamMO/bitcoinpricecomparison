"use client";

import { useEffect } from "react";
import { adConfig } from "@/lib/ad-config";

/**
 * Loads the ad network's external script tag.
 * Renders nothing if no ad network is configured.
 * Should be placed once in the root layout.
 */
export function AdScript() {
  const network = adConfig.activeNetwork;

  useEffect(() => {
    if (!network) return;

    // Avoid double-loading
    const scriptId = "ad-network-script";
    if (document.getElementById(scriptId)) return;

    let src = "";

    switch (network) {
      case "adsense":
        src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adConfig.adsense!.clientId}`;
        break;
      case "coinzilla":
        src = "https://coinzilla.com/lib/display.js";
        break;
      case "custom":
        src = adConfig.custom!.scriptUrl;
        break;
    }

    if (!src) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = src;
    script.async = true;
    if (network === "adsense") {
      script.crossOrigin = "anonymous";
    }
    document.head.appendChild(script);
  }, [network]);

  // This component renders nothing to the DOM
  return null;
}
