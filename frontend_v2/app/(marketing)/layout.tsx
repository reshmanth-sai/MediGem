import type { Metadata } from "next";
import "@/styles/landing.css";

export const metadata: Metadata = {
  title: { absolute: "MediGem" },
  description:
    "Clinical decision support that runs entirely on local hardware. Lab reports, ECGs, prescriptions and wound images, assessed without an uplink.",
  alternates: { canonical: "/" },
};

// Marketing surfaces share the root providers but carry their own stylesheet
// and colour system. The .landing class scopes every token in landing.css.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing">{children}</div>
  );
}
