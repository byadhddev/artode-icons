const SITE = {
  NAME: "artode-icons",
  URL: "https://artode-icons.com",
  OG_IMAGE: "/og.png",
  AUTHOR: {
    NAME: "artode",
    TWITTER: "@artode",
  },
  DESCRIPTION: {
    LONG: "A Swiss-design inspired icon library featuring interference patterns and minimalist aesthetics. Built for modern web applications.",
    SHORT: "Swiss-design inspired animated React icons.",
  },
  KEYWORDS: [
    "artode icons",
    "swiss design",
    "animated icons",
    "react icons",
    "svg icons",
    "interference pattern",
    "minimalist icons",
  ],
} as const;

const LINK = {
  TWITTER: "https://x.com/artode",
  GITHUB: "https://github.com/adhdpaws/artode-icons",
  LUCIDE: "https://lucide.dev",
  MOTION: "https://motion.dev",
  LICENSE: "https://github.com/artode/icons/blob/main/LICENSE",
} as const;

const PACKAGE_MANAGER = {
  PNPM: "pnpm",
  NPM: "npm",
  YARN: "yarn",
  BUN: "bun",
} as const;

export { LINK, PACKAGE_MANAGER, SITE };
