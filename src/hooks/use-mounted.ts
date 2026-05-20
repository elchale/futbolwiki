"use client";

import { useEffect, useState } from "react";

/** True after first client render — used to avoid hydration mismatch with theme-aware UI. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
