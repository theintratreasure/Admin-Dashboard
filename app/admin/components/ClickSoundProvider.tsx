"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type ClickSoundContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  toggle: () => void;
};

const ClickSoundContext = createContext<ClickSoundContextValue | null>(null);

const STORAGE_KEY = "admin.clickSound.enabled";
const DEFAULT_ENABLED = true;

const readStorageValue = (): boolean => {
  if (typeof window === "undefined") return DEFAULT_ENABLED;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "0") return false;
  if (raw === "1") return true;
  return DEFAULT_ENABLED;
};

const writeStorageValue = (next: boolean) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
};

const isInteractiveTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  if (target.closest('[data-click-sound="off"]')) return false;

  const ignoredInput = target.closest(
    'textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"])'
  );
  if (ignoredInput) return false;

  return Boolean(
    target.closest(
      'button, a, summary, select, [role="button"], [role="menuitem"], input[type="checkbox"], input[type="radio"], input[type="range"], input[type="submit"], [data-click-sound="on"]'
    )
  );
};

const roundGain = (value: number) => Math.round(value * 10000) / 10000;

export function ClickSoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(() => readStorageValue());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastPlayAtRef = useRef(0);

  const setEnabled = (next: boolean) => {
    setEnabledState(next);
    writeStorageValue(next);
  };

  const toggle = () => setEnabledState((prev) => {
    const next = !prev;
    writeStorageValue(next);
    return next;
  });

  useEffect(() => {
    writeStorageValue(enabled);
  }, [enabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const playClick = () => {
      const nowMs = performance.now();
      if (nowMs - lastPlayAtRef.current < 35) return;
      lastPlayAtRef.current = nowMs;

      const AudioContextCtor =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      const ctx = audioCtxRef.current ?? new AudioContextCtor();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => undefined);
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(1600, ctx.currentTime);

      const startTime = ctx.currentTime;
      const peak = roundGain(0.055);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(peak, startTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.035);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.04);

      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    };

    const handler = (event: PointerEvent) => {
      if (!enabled) return;
      if (!isInteractiveTarget(event.target)) return;
      playClick();
    };

    window.addEventListener("pointerdown", handler, { capture: true, passive: true });
    return () =>
      window.removeEventListener("pointerdown", handler, { capture: true });
  }, [enabled]);

  const value: ClickSoundContextValue = { enabled, setEnabled, toggle };

  return <ClickSoundContext.Provider value={value}>{children}</ClickSoundContext.Provider>;
}

export function useClickSoundSettings() {
  const ctx = useContext(ClickSoundContext);
  if (!ctx) {
    throw new Error("useClickSoundSettings must be used within ClickSoundProvider");
  }
  return ctx;
}
