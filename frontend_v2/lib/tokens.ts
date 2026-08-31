export interface TokenSet {
  ground: string;
  surface: string;
  surfaceRaised: string;
  rule: string;
  ruleStrong: string;
  inkDisabled: string;
  inkMuted: string;
  ink: string;
  action: string;
  actionHover: string;
  actionActive: string;
  actionSubtle: string;
  onAction: string;
  riskEmergency: string;
  riskHigh: string;
  riskModerate: string;
  riskLow: string;
  focus: string;
}

export const TOKENS: { light: TokenSet; dark: TokenSet } = {
  light: {
    ground: "#F4F7F5",
    surface: "#FBFCFB",
    surfaceRaised: "#E8EDEA",
    rule: "#D5DDD8",
    ruleStrong: "#8A958E",
    inkDisabled: "#AFBAB4",
    inkMuted: "#626C66",
    ink: "#1A211D",
    action: "#2D3F73",
    actionHover: "#24325C",
    actionActive: "#1B2645",
    actionSubtle: "#EEF0F7",
    onAction: "#FBFCFB",
    riskEmergency: "#A82F26",
    riskHigh: "#8C5A0A",
    riskModerate: "#7A6206",
    riskLow: "#2F6B4F",
    focus: "#3B5099",
  },
  dark: {
    ground: "#111815",
    surface: "#18211D",
    surfaceRaised: "#212B26",
    rule: "#313D37",
    ruleStrong: "#64736C",
    inkDisabled: "#5F6E66",
    inkMuted: "#9DAAA3",
    ink: "#E9EFEB",
    action: "#7C90D9",
    actionHover: "#93A4E3",
    actionActive: "#A8B6EA",
    actionSubtle: "#1E2740",
    onAction: "#0F1613",
    riskEmergency: "#F2726A",
    riskHigh: "#E0A33F",
    riskModerate: "#D8C158",
    riskLow: "#5FBF8C",
    focus: "#93A4E3",
  },
};
