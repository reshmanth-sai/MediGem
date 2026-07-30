"use client";

import { useEffect, useState } from "react";

/** Type-safe hook synchronizing state with window.localStorage */
export function useLocalStorage<T>(key: str, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch {
        // Fallback silently if storage quota exceeded
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
