import { describe, it, expect } from "vitest";
import { contrastRatio } from "./contrast";
import { TOKENS, type TokenSet } from "./tokens";

const THEMES: Array<[string, TokenSet]> = [
  ["light", TOKENS.light],
  ["dark", TOKENS.dark],
];

describe.each(THEMES)("%s theme contrast", (_name, t) => {
  it.each([
    ["ink on surface", t.ink, t.surface, 4.5],
    ["ink on ground", t.ink, t.ground, 4.5],
    ["muted ink on surface", t.inkMuted, t.surface, 4.5],
    ["muted ink on ground", t.inkMuted, t.ground, 4.5],
    ["action on surface", t.action, t.surface, 4.5],
    ["onAction on action", t.onAction, t.action, 4.5],
    ["emergency on surface", t.riskEmergency, t.surface, 4.5],
    ["high on surface", t.riskHigh, t.surface, 4.5],
    ["moderate on surface", t.riskModerate, t.surface, 4.5],
    ["low on surface", t.riskLow, t.surface, 4.5],
  ])("%s meets AA body text", (_label, fg, bg, min) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });

  it.each([
    ["input border on surface", t.ruleStrong, t.surface, 3],
    ["focus ring on surface", t.focus, t.surface, 3],
  ])("%s meets AA non-text (WCAG 1.4.11)", (_label, fg, bg, min) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});
