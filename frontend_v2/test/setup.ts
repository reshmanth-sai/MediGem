import "@testing-library/jest-dom/vitest";

// Some Node.js versions expose an experimental global `localStorage` that
// conflicts with jsdom's own Storage implementation, leaving
// `window.localStorage` undefined (or throwing) under Vitest. This is a
// test-environment quirk only, real browsers are unaffected, and
// hooks/useLocalStorage.ts already guards every access in try/catch so the
// app degrades gracefully either way. Install a minimal in-memory polyfill
// here, but only if jsdom's own localStorage is actually unusable, so any
// test that persists state through localStorage gets deterministic,
// working storage.
if (typeof window !== "undefined") {
  let usable = false;
  try {
    window.localStorage.setItem("__localstorage_probe__", "1");
    window.localStorage.removeItem("__localstorage_probe__");
    usable = true;
  } catch {
    usable = false;
  }

  if (!usable) {
    let store: Record<string, string> = {};
    const memoryLocalStorage: Storage = {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = String(value);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (index: number) => Object.keys(store)[index] ?? null,
      get length() {
        return Object.keys(store).length;
      },
    };

    Object.defineProperty(window, "localStorage", {
      value: memoryLocalStorage,
      configurable: true,
    });
  }
}
