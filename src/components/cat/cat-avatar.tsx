import { useId } from "react";
import { cn } from "@/lib/utils";
import { catPalette, INK, PINK, type CatLook } from "@/lib/cat";

const EAR_L = "M60 96 L55 30 L108 66 Z";
const EAR_R = "M180 96 L185 30 L132 66 Z";

type Props = {
  look: CatLook;
  mood?: "idle" | "happy";
  /** Crop to the head, for thumbnails and small icons. */
  head?: boolean;
  className?: string;
  label?: string;
};

/** Parametric cat. Pure SVG, safe on the server. Animation hooks live in globals.css. */
export function CatAvatar({ look, mood = "idle", head = false, className, label }: Props) {
  const clipId = "cat" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const p = catPalette(look);
  const viewBox = head ? "34 20 172 152" : "0 0 240 252";

  return (
    <span className={cn("cat", mood === "happy" && "is-happy", className)}>
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full overflow-visible"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        <defs>
          <clipPath id={clipId}>
            <ellipse cx="120" cy="190" rx="58" ry="50" />
            <ellipse cx="120" cy="112" rx="68" ry="56" />
            <path d={EAR_L} />
            <path d={EAR_R} />
          </clipPath>
        </defs>

        <ellipse cx="120" cy="244" rx="64" ry="7" fill="rgba(0,0,0,.12)" />

        <g className="cat-breathe">
          <g className="cat-tail">
            <path
              d="M166 214 C212 218 226 170 206 148"
              fill="none"
              stroke={p.tailLine}
              strokeWidth={p.tailWidth + 8}
              strokeLinecap="round"
            />
            <path
              d="M166 214 C212 218 226 170 206 148"
              fill="none"
              stroke={p.tailCol}
              strokeWidth={p.tailWidth}
              strokeLinecap="round"
            />
          </g>

          <ellipse cx="120" cy="190" rx="58" ry="50" fill={p.base} stroke={p.line} strokeWidth="4" />
          <g className="cat-ear-l">
            <path d={EAR_L} fill={p.base} stroke={p.line} strokeWidth="6" strokeLinejoin="round" />
          </g>
          <g className="cat-ear-r">
            <path d={EAR_R} fill={p.base} stroke={p.line} strokeWidth="6" strokeLinejoin="round" />
          </g>

          {p.fluffy && (
            <>
              <path d="M58 110 L36 116 L56 126 L38 140 L64 136 Z" fill={p.base} stroke={p.line} strokeWidth="4" strokeLinejoin="round" />
              <path d="M182 110 L204 116 L184 126 L202 140 L176 136 Z" fill={p.base} stroke={p.line} strokeWidth="4" strokeLinejoin="round" />
            </>
          )}

          <ellipse cx="120" cy="112" rx="68" ry="56" fill={p.base} stroke={p.line} strokeWidth="4" />

          <g clipPath={`url(#${clipId})`}>
            {look.pattern === "tabby" && (
              <g fill="none" stroke={p.stripe} strokeWidth="6" strokeLinecap="round">
                <path d="M120 58 V80" />
                <path d="M102 62 L106 82" />
                <path d="M138 62 L134 82" />
                <path d="M52 108 H76" />
                <path d="M53 122 L77 119" />
                <path d="M188 108 H164" />
                <path d="M187 122 L163 119" />
                <path d="M70 160 Q84 172 82 192" />
                <path d="M62 180 Q76 190 74 208" />
                <path d="M170 160 Q156 172 158 192" />
                <path d="M178 180 Q164 190 166 208" />
              </g>
            )}
            {look.pattern === "tuxedo" && (
              <g fill={p.sec}>
                <path d="M120 62 Q104 94 94 126 Q120 154 146 126 Q136 94 120 62Z" />
                <ellipse cx="120" cy="200" rx="28" ry="38" />
              </g>
            )}
            {look.pattern === "calico" && (
              <g>
                <ellipse cx="82" cy="80" rx="36" ry="28" fill={p.patch1} />
                <ellipse cx="164" cy="72" rx="30" ry="24" fill={p.patch2} />
                <ellipse cx="76" cy="196" rx="30" ry="28" fill={p.patch1} />
                <ellipse cx="168" cy="208" rx="28" ry="24" fill={p.patch2} />
              </g>
            )}
            {look.pattern === "pointed" && (
              <g fill={p.point}>
                <path d={EAR_L} />
                <path d={EAR_R} />
                <ellipse cx="120" cy="134" rx="30" ry="22" opacity=".85" />
                <ellipse cx="120" cy="106" rx="54" ry="26" opacity=".22" />
              </g>
            )}
          </g>

          <path d="M68 84 L66 50 L94 68 Z" fill={PINK} opacity=".85" />
          <path d="M172 84 L174 50 L146 68 Z" fill={PINK} opacity=".85" />
          <ellipse cx="98" cy="232" rx="19" ry="11" fill={p.pawFill} stroke={p.line} strokeWidth="4" />
          <ellipse cx="142" cy="232" rx="19" ry="11" fill={p.pawFill} stroke={p.line} strokeWidth="4" />
          <ellipse cx="74" cy="132" rx="10" ry="6" fill={PINK} opacity=".4" />
          <ellipse cx="166" cy="132" rx="10" ry="6" fill={PINK} opacity=".4" />

          <g className="cat-eyes">
            <g className="cat-blink cat-idle">
              <ellipse cx="93" cy="110" rx="12" ry="14.5" fill={p.eye} stroke={p.eyeLine} strokeWidth="2" />
              <ellipse cx="147" cy="110" rx="12" ry="14.5" fill={p.eye} stroke={p.eyeLine} strokeWidth="2" />
              <ellipse cx="93" cy="110" rx="4.5" ry="11" fill={INK} />
              <ellipse cx="147" cy="110" rx="4.5" ry="11" fill={INK} />
              <circle cx="89" cy="103" r="3.8" fill="#fff" />
              <circle cx="143" cy="103" r="3.8" fill="#fff" />
              <circle cx="97" cy="117" r="1.9" fill="#fff" />
              <circle cx="151" cy="117" r="1.9" fill="#fff" />
            </g>
            <g className="cat-happy" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round">
              <path d="M81 115 Q93 98 105 115" />
              <path d="M135 115 Q147 98 159 115" />
            </g>
          </g>

          <path d="M113 126 Q120 121 127 126 Q124 134 120 135 Q116 134 113 126Z" fill="#FF7F99" />
          <g className="cat-idle" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M120 135 V139 M120 139 Q113 146 106 140 M120 139 Q127 146 134 140" />
          </g>
          <path
            className="cat-happy"
            d="M107 139 Q120 160 133 139 Z"
            fill="#E8567A"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <g stroke="var(--whisker)" strokeWidth="2.4" strokeLinecap="round" fill="none">
            <path d="M78 136 L46 130" />
            <path d="M78 142 L48 148" />
            <path d="M162 136 L194 130" />
            <path d="M162 142 L192 148" />
          </g>
        </g>
      </svg>
    </span>
  );
}
