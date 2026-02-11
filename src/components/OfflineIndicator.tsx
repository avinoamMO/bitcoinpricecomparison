"use client";

import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    function handleOffline() {
      setIsOffline(true);
    }

    function handleOnline() {
      setIsOffline(false);
    }

    // Check initial state
    setIsOffline(!navigator.onLine);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-0 left-0 right-0 z-50 bg-amber-600 px-4 py-2 text-center text-sm font-medium text-white"
    >
      You&apos;re offline. Showing last cached prices.
    </div>
  );
}
