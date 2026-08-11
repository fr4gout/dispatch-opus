/**
 * FiveM NUI bridge.
 * NUI -> Lua : fetchNui(event, data)
 * Lua -> NUI : window.addEventListener("message", ...)
 */

declare global {
  interface Window {
    GetParentResourceName?: () => string;
    invokeNative?: unknown;
  }
}

export const isNuiEnvironment = (): boolean =>
  typeof window !== "undefined" && typeof window.GetParentResourceName === "function";

export const resourceName = (): string =>
  typeof window !== "undefined" && window.GetParentResourceName
    ? window.GetParentResourceName()
    : "polarix_truckerjob";

export async function fetchNui<T = unknown>(
  eventName: string,
  data: Record<string, unknown> = {},
): Promise<T | null> {
  if (typeof window === "undefined") return null;

  if (!isNuiEnvironment()) {
    // Browser preview fallback — log the payload the Lua side would receive.
    console.info(`[NUI:${eventName}]`, data);
    return null;
  }

  try {
    const res = await fetch(`https://${resourceName()}/${eventName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data),
    });
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[NUI:${eventName}] failed`, err);
    return null;
  }
}

export type NuiMessage = { action: string; data?: unknown };

export function onNuiMessage(handler: (msg: NuiMessage) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (event: MessageEvent) => {
    const payload = event.data as NuiMessage | undefined;
    if (payload && typeof payload.action === "string") handler(payload);
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}
