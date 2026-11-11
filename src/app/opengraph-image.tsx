import { ImageResponse } from "next/og";
import { BRAND, brandIconSvg } from "@/lib/brand";
import { SITE_NAME } from "@/lib/site";

export const alt = "Catz: cat training that starts with your cat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const icon = `data:image/svg+xml;base64,${Buffer.from(brandIconSvg({ size: 420, scale: 0.8, radius: 96 })).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "#FFF3E4",
          color: BRAND.ink,
        }}
      >
        <img src={icon} width={360} height={360} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1 }}>{SITE_NAME}</div>
          <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.2, maxWidth: 560 }}>Cat training that starts with your cat.</div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#CF6500" }}>Five minutes a day. A clicker. A treat.</div>
        </div>
      </div>
    ),
    size,
  );
}
