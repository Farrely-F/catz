/** Cat look: the data behind the parametric avatar. Pure and framework-free. */

export const COATS = [
  { id: "ginger", name: "Ginger", hex: "#F2994A" },
  { id: "charcoal", name: "Charcoal", hex: "#4B5163" },
  { id: "gray", name: "Gray", hex: "#A3AEC2" },
  { id: "snow", name: "Snow", hex: "#F4F4F0" },
  { id: "cream", name: "Cream", hex: "#EFD3A0" },
  { id: "cocoa", name: "Cocoa", hex: "#7B543B" },
] as const;

export const EYES = {
  amber: { name: "Amber", hex: "#F5A623" },
  green: { name: "Green", hex: "#5BC66B" },
  blue: { name: "Blue", hex: "#4DB3F2" },
  copper: { name: "Copper", hex: "#C9772B" },
} as const;

export const PATTERNS = [
  { id: "solid", name: "Solid" },
  { id: "tabby", name: "Tabby" },
  { id: "tuxedo", name: "Tuxedo" },
  { id: "calico", name: "Calico" },
  { id: "pointed", name: "Pointed" },
] as const;

export type CatPattern = (typeof PATTERNS)[number]["id"];
export type EyeColor = keyof typeof EYES;
export type Fur = "short" | "fluffy";

export type CatLook = {
  coat: string;
  pattern: CatPattern;
  eyes: EyeColor;
  fur: Fur;
};

export const DEFAULT_LOOK: CatLook = {
  coat: COATS[0].hex,
  pattern: "tabby",
  eyes: "amber",
  fur: "short",
};

const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];

/** Mix `hex` toward `to` by `t` (0..1). */
export function mix(hex: string, t: number, to: string): string {
  const a = rgb(hex);
  const b = rgb(to);
  return (
    "#" +
    a
      .map((v, i) =>
        Math.round(v + (b[i] - v) * t)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/** Perceived brightness, 0..1. */
export function luminance(hex: string): number {
  const [r, g, b] = rgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export const INK = "#2A2035";
export const WHITE = "#FBFBF8";
export const PINK = "#FF9DB0";

/** Every color the avatar SVG needs, derived from the look. */
export function catPalette(look: CatLook) {
  const main = look.coat;
  const light = luminance(main) > 0.78;
  const patch1 = light ? "#F2994A" : main;
  const patch2 = "#3E4255";
  const point = luminance(main) > 0.6 ? "#8A6A52" : main;
  const base =
    look.pattern === "calico" ? WHITE : look.pattern === "pointed" ? "#F3E4CB" : main;
  const line = mix(base, 0.38, "#1A1020");
  const tailCol =
    look.pattern === "pointed" ? point : look.pattern === "calico" ? patch1 : base;
  const eye = EYES[look.eyes].hex;
  return {
    base,
    line,
    stripe: mix(main, 0.38, "#000000"),
    sec: light ? "#C9D0DE" : WHITE,
    point,
    patch1,
    patch2,
    tailCol,
    tailLine: mix(tailCol, 0.38, "#1A1020"),
    tailWidth: look.fur === "fluffy" ? 20 : 14,
    eye,
    eyeLine: mix(eye, 0.45, "#000000"),
    pawFill:
      look.pattern === "tuxedo" ? (light ? "#C9D0DE" : WHITE) : look.pattern === "pointed" ? point : base,
    fluffy: look.fur === "fluffy",
  };
}
