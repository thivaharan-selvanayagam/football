// lib/renderCardCanvas.ts

export interface RenderCardOptions {
  name: string;
  position: string;
  overall: number;
  attrs: { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number };
  gradient: [string, string];
  frameImage?: string;
  photo?: string | null;
  clubBadge?: string | null;
  countryFlag?: string | null;
  brandLogo?: string | null;
  textColor?: string;
}

function loadImg(src?: string | null): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const timer = setTimeout(() => resolve(null), 4000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });
}

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / (img.naturalHeight || 1);
  const boxRatio = w / h;
  let drawW = w;
  let drawH = h;
  if (imgRatio > boxRatio) {
    drawH = w / imgRatio;
  } else {
    drawW = h * imgRatio;
  }
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;
  ctx.drawImage(img, dx, dy, drawW, drawH);
}

/**
 * Renders the full FUT card (frame + BG-removed cutout photo + rating/pos + name + 6 stats + flag + badge + logo)
 * onto an offscreen HTML5 Canvas so it never fails due to SVG Blob security restrictions or mobile hidden containers.
 */
export async function renderCardToDataUrl(opts: RenderCardOptions): Promise<string | null> {
  try {
    const scale = 2; // 520 x 702 crisp output
    const baseW = 260;
    const baseH = 351;

    const canvas = document.createElement("canvas");
    canvas.width = baseW * scale;
    canvas.height = baseH * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.scale(scale, scale);

    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      try {
        await Promise.race([
          (document as any).fonts.ready,
          new Promise((r) => setTimeout(r, 1000)),
        ]);
      } catch {}
    }

    const [frameImg, photoImg, flagImg, badgeImg, logoImg] = await Promise.all([
      loadImg(opts.frameImage),
      loadImg(opts.photo),
      loadImg(opts.countryFlag),
      loadImg(opts.clubBadge),
      loadImg(opts.brandLogo ?? "/images/logo.png"),
    ]);

    // 1. Card frame background
    if (frameImg) {
      ctx.drawImage(frameImg, 0, 0, baseW, baseH);
    } else {
      const grad = ctx.createLinearGradient(0, 0, baseW, baseH);
      grad.addColorStop(0, opts.gradient[0] || "#caa84a");
      grad.addColorStop(1, opts.gradient[1] || "#f3da8d");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(130, 4);
      ctx.lineTo(246, 36);
      ctx.lineTo(246, 190);
      ctx.bezierCurveTo(246, 270, 196, 320, 130, 347);
      ctx.bezierCurveTo(64, 320, 14, 270, 14, 190);
      ctx.lineTo(14, 36);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Player BG-removed portrait photo
    if (photoImg) {
      drawContain(ctx, photoImg, 42, 48, 176, 180);
    }

    const textColor = opts.textColor || "#3c3f25";
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";

    // 3. Overall Rating & Position
    ctx.font = "700 34px Oswald, Arial Narrow, sans-serif";
    ctx.fillText(String(opts.overall ?? 97), 48, 78);

    ctx.font = "700 14px Oswald, Arial Narrow, sans-serif";
    ctx.fillText((opts.position || "CAM").toUpperCase(), 48, 96);

    // 4. Player Name
    const formattedName = opts.name
      ? opts.name.charAt(0).toUpperCase() + opts.name.slice(1)
      : "Player";
    ctx.font = "700 22px Oswald, Arial Narrow, sans-serif";
    ctx.fillText(formattedName, 130, 252);

    // 5. Stats Matrix
    const entries = Object.entries(opts.attrs || {});
    entries.forEach(([k, v], i) => {
      const x = 48 + i * 33;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.font = "700 10px Inter, Arial, sans-serif";
      ctx.fillText(k, x, 276);
      ctx.restore();

      ctx.font = "700 20px Oswald, Arial Narrow, sans-serif";
      ctx.fillText(String(v), x, 294);
    });

    // 6. Country Flag & Club Badge (matching translate(0, -6) in FutCard.tsx)
    if (flagImg) {
      ctx.drawImage(flagImg, 104, 299, 26, 15);
    }
    if (badgeImg) {
      drawContain(ctx, badgeImg, 135.5, 298.5, 17, 17);
    }

    // 7. Brand Logo
    if (logoImg) {
      drawContain(ctx, logoImg, 93, 308, 75, 30);
    }

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("renderCardToDataUrl failed:", err);
    return null;
  }
}

/**
 * Resizes an uploaded File into a clean base64 data URL capped at `maxDim` pixels.
 */
export function resizeImageFileToDataUrl(
  file: File,
  maxDim = 1200,
  mimeType: "image/jpeg" | "image/png" = "image/jpeg",
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl =
          mimeType === "image/jpeg"
            ? canvas.toDataURL("image/jpeg", quality)
            : canvas.toDataURL("image/png");
        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      } catch (e) {
        URL.revokeObjectURL(objectUrl);
        reject(e);
      }
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}
