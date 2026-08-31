// src/app/components/auth/IdleTimer.tsx
"use client";

import { useEffect, useCallback, useRef } from "react";
import { signOut } from "next-auth/react";

export default function IdleTimer() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const IDLE_TIME_LIMIT = 15 * 60 * 1000; // 15 minutos de inactividad

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/auth/login?reason=idle" });
  }, []);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleLogout, IDLE_TIME_LIMIT);
  }, [IDLE_TIME_LIMIT, handleLogout]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  return null;
}