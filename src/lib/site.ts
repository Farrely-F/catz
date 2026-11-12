/** Public site facts. Set NEXT_PUBLIC_SITE_URL in production, it is used for canonical and social URLs. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Catz";
export const SITE_TITLE = "Catz: cat training that starts with your cat";
export const SITE_DESCRIPTION =
  "Clicker training for cats in five minutes a day. Build a cat that looks like yours and get a plan that fits its personality, age and your schedule.";
export const THEME_COLOR = "#FF8A1F";
