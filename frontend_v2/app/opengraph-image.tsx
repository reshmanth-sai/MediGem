import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MediGem. Care that works when the network doesn't.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The hero, as a card. Same ink and signal as styles/landing.css; the serif
// is the platform fallback because font files are not available at the
// edge without an extra fetch.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#111815",
          color: "#E9EFEB",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          fontFamily: "Georgia, Times New Roman, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9DAAA3", fontFamily: "Menlo, monospace" }}>
          <span>MediGem</span>
          <span>local inference · no uplink required</span>
        </div>
        <svg width="1072" height="90" viewBox="0 0 1072 90" style={{ display: "flex" }}>
          <polyline
            fill="none"
            stroke="#E0A33F"
            strokeWidth="3"
            points="0,60 700,60 730,60 745,58 760,40 775,88 790,10 805,72 820,60 860,60 890,48 920,60 1072,60"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 0.95, letterSpacing: -3, textTransform: "uppercase" }}>
          <span>Care that works</span>
          <span>when the network</span>
          <span>doesn&apos;t.</span>
        </div>
      </div>
    ),
    size
  );
}
