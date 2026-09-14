"use client";

import { useEffect, useState } from "react";

export interface SystemStatus {
  /** navigator.onLine; null until mounted so SSR and first paint agree. */
  online: boolean | null;
  /** Free quota from the Storage API, in GB, or null where unsupported. */
  storageFreeGb: number | null;
}

/**
 * The two things a browser can honestly report about its own environment.
 * Anything about the model, the gate or the pipeline comes from the API,
 * not from here.
 */
export function useSystemStatus(): SystemStatus {
  const [status, setStatus] = useState<SystemStatus>({ online: null, storageFreeGb: null });

  useEffect(() => {
    const update = () => setStatus((s) => ({ ...s, online: navigator.onLine }));
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    if (typeof navigator.storage?.estimate === "function") {
      navigator.storage
        .estimate()
        .then(({ quota, usage }) => {
          if (typeof quota === "number") {
            setStatus((s) => ({ ...s, storageFreeGb: (quota - (usage ?? 0)) / 1024 ** 3 }));
          }
        })
        .catch(() => {});
    }
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return status;
}
