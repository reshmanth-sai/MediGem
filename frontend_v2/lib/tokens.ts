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
    ground: "#F8F7F3",
    surface: "#FCFBF8",
    surfaceRaised: "#F3F2EE",
    rule: "#DDDDE2",
    ruleStrong: "#8E8E9A",
    inkDisabled: "#98A0AE",
    inkMuted: "#667085",
    ink: "#202638",
    action: "#5668A9",
    actionHover: "#46588F",
    actionActive: "#3D4D7D",
    actionSubtle: "#E9E8F2",
    onAction: "#FFFFFF",
    riskEmergency: "#9B4B48",
    riskHigh: "#995E20",
    riskModerate: "#8D5D18",
    riskLow: "#4D7359",
    focus: "#5668A9",
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
