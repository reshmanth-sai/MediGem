import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * This project's tailwind.config.js defines a custom fontSize scale with
 * keys like h1, h2, h3, body, body-sm, label, data, data-lg, display,
 * producing utility classes text-h1, text-h2, etc. Plain twMerge cannot
 * tell these apart from text color classes (text-ink, text-risk-emergency)
 * since both look like text-{word}, so it puts them in the same conflict
 * group and silently drops one. Telling twMerge these values belong to the
 * existing font-size group (not the text-color group) fixes that, while
 * real font-size vs font-size and color vs color conflicts still resolve
 * exactly as before.
 */
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "body",
            "body-sm",
            "label",
            "data",
            "data-lg",
          ],
        },
      ],
    },
  },
});

/** Class name merger combining clsx and tailwind-merge */
export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs));
}
