// Generates every raster icon from the Catz mark in src/lib/brand.ts.
// Run: npm run icons   (needs Node 22+, which runs the .ts import below directly)
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { brandIconSvg } from "../src/lib/brand.ts";

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** A .ico that wraps PNG images (supported by every modern browser). */
function ico(images) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([head, ...entries, ...images.map((i) => i.data)]);
}

await mkdir("public/icons", { recursive: true });

const any = brandIconSvg({ size: 512, scale: 0.74 });
const maskable = brandIconSvg({ size: 512, scale: 0.56 });

await writeFile("public/icons/icon-192.png", await png(any, 192));
await writeFile("public/icons/icon-512.png", await png(any, 512));
await writeFile("public/icons/maskable-512.png", await png(maskable, 512));
await writeFile("src/app/apple-icon.png", await png(any, 180));
await writeFile("src/app/icon.svg", brandIconSvg({ size: 512, scale: 0.74, radius: 112 }));
await writeFile(
  "src/app/favicon.ico",
  ico([
    { size: 32, data: await png(brandIconSvg({ size: 512, scale: 0.8, radius: 112 }), 32) },
    { size: 48, data: await png(brandIconSvg({ size: 512, scale: 0.8, radius: 112 }), 48) },
  ]),
);

console.log("icons written: public/icons/*, src/app/{icon.svg,apple-icon.png,favicon.ico}");
