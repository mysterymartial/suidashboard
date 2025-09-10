import { toPng } from "html-to-image";

export async function exportElementAsImage(
  element: HTMLElement,
  options?: { filename?: string; watermarkText?: string },
): Promise<void> {
  const fileName = options?.filename || "export.png";
  const watermark = (options?.watermarkText || "suihub africa").toUpperCase();

  // Render element to PNG data URL
  const dataUrl = await toPng(element, {
    backgroundColor: "white",
    pixelRatio: 2,
    cacheBust: true,
    style: {
      // Ensure text colors render well on white bg
      color: getComputedStyle(document.documentElement).color || "#292929",
    },
  });

  // Load base image onto canvas
  const baseImage = new Image();
  baseImage.crossOrigin = "anonymous";
  baseImage.src = dataUrl;

  await new Promise<void>((resolve, reject) => {
    baseImage.onload = () => resolve();
    baseImage.onerror = () => reject(new Error("Failed to load base image"));
  });

  const canvas = document.createElement("canvas");
  canvas.width = baseImage.width;
  canvas.height = baseImage.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Draw the captured image
  ctx.drawImage(baseImage, 0, 0);

  // Draw diagonal semi-transparent watermark repeated
  const fontSize = Math.max(14, Math.floor(canvas.width / 30));
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((-25 * Math.PI) / 180);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#292929";
  ctx.font = `bold ${fontSize}px sans-serif`;

  const gapX = fontSize * 8;
  const gapY = fontSize * 6;
  for (let x = -canvas.width; x < canvas.width; x += gapX) {
    for (let y = -canvas.height; y < canvas.height; y += gapY) {
      ctx.fillText(watermark, x, y);
    }
  }
  ctx.restore();

  // Trigger download
  const link = document.createElement("a");
  link.download = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
