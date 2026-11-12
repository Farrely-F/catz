/**
 * The Catz mark: a ginger tabby head. Pure strings so it can feed the icon generator
 * (`npm run icons`), the social image and anything else that needs a static SVG.
 */

export const BRAND = {
  ink: "#1B2140",
  ginger: "#FF8A1F",
  white: "#FFFFFF",
  darkBg: "#0E1322",
} as const;

/** Visual bounds of the head, ears and whiskers in the avatar's 240x252 space. */
const BOUNDS = { x: 44, y: 26, w: 152, h: 144 };

function headInner(whisker: string) {
  return `
  <path d="M60 96 L55 30 L108 66 Z" fill="#F2994A" stroke="#A0653A" stroke-width="6" stroke-linejoin="round"/>
  <path d="M180 96 L185 30 L132 66 Z" fill="#F2994A" stroke="#A0653A" stroke-width="6" stroke-linejoin="round"/>
  <ellipse cx="120" cy="112" rx="68" ry="56" fill="#F2994A" stroke="#A0653A" stroke-width="4"/>
  <g fill="none" stroke="#965F2E" stroke-width="6" stroke-linecap="round">
    <path d="M120 58 V80"/><path d="M102 62 L106 82"/><path d="M138 62 L134 82"/>
    <path d="M54 108 H76"/><path d="M55 122 L77 119"/><path d="M186 108 H164"/><path d="M185 122 L163 119"/>
  </g>
  <path d="M68 84 L66 50 L94 68 Z" fill="#FF9DB0" opacity=".85"/>
  <path d="M172 84 L174 50 L146 68 Z" fill="#FF9DB0" opacity=".85"/>
  <ellipse cx="74" cy="132" rx="10" ry="6" fill="#FF9DB0" opacity=".4"/>
  <ellipse cx="166" cy="132" rx="10" ry="6" fill="#FF9DB0" opacity=".4"/>
  <ellipse cx="93" cy="110" rx="12" ry="14.5" fill="#F5A623" stroke="#875B13" stroke-width="2"/>
  <ellipse cx="147" cy="110" rx="12" ry="14.5" fill="#F5A623" stroke="#875B13" stroke-width="2"/>
  <ellipse cx="93" cy="110" rx="4.5" ry="11" fill="#2A2035"/>
  <ellipse cx="147" cy="110" rx="4.5" ry="11" fill="#2A2035"/>
  <circle cx="89" cy="103" r="3.8" fill="#fff"/><circle cx="143" cy="103" r="3.8" fill="#fff"/>
  <circle cx="97" cy="117" r="1.9" fill="#fff"/><circle cx="151" cy="117" r="1.9" fill="#fff"/>
  <path d="M113 126 Q120 121 127 126 Q124 134 120 135 Q116 134 113 126Z" fill="#FF7F99"/>
  <path d="M120 135 V139 M120 139 Q113 146 106 140 M120 139 Q127 146 134 140" fill="none" stroke="#2A2035" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <g stroke="${whisker}" stroke-width="2.4" stroke-linecap="round" fill="none">
    <path d="M78 136 L46 130"/><path d="M78 142 L48 148"/><path d="M162 136 L194 130"/><path d="M162 142 L192 148"/>
  </g>`;
}

/**
 * Square icon: the head centered on a solid background.
 * `scale` is how much of the width the head fills (keep ~0.56 for maskable, inside the safe zone).
 */
export function brandIconSvg({
  size = 512,
  scale = 0.72,
  bg = BRAND.ink,
  radius = 0,
}: { size?: number; scale?: number; bg?: string; radius?: number } = {}): string {
  const s = (size * scale) / BOUNDS.w;
  const cx = BOUNDS.x + BOUNDS.w / 2;
  const cy = BOUNDS.y + BOUNDS.h / 2;
  const tx = size / 2 - cx * s;
  const ty = size / 2 - cy * s;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${bg}"/>` +
    `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})">${headInner("rgba(255,255,255,0.7)")}</g>` +
    `</svg>`
  );
}
