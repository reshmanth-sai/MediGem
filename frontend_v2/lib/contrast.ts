/** WCAG 2.1 relative luminance and contrast ratio. */

function expand(hex: string): string {
  const h = hex.trim().replace(/^#/, "");
  if (h.length === 3) return h.split("").map((c) => c + c).join("");
  return h;
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const h = expand(hex);
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  const r = channel(parseInt(h.slice(0, 2), 16));
  const g = channel(parseInt(h.slice(2, 4), 16));
  const b = channel(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}
