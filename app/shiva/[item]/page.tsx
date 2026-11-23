import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getApparelProduct } from "@/lib/data";
import ApparelProductView from "@/components/ApparelProductView";

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

function getApparelImages(folder: string, fallback: string): string[] {
  try {
    const absDir = path.join(process.cwd(), "public", folder);
    const files = fs
      .readdirSync(absDir)
      .filter((file) => IMAGE_EXTS.has(path.extname(file).toLowerCase()));

    // Ensure image named "1" (e.g. 1.png, 1.webp, 1.jpg) is always first (featured),
    // followed by the rest sorted naturally (2, 3, 4, ...).
    files.sort((a, b) => {
      const baseA = path.parse(a).name;
      const baseB = path.parse(b).name;
      if (baseA === "1" && baseB !== "1") return -1;
      if (baseB === "1" && baseA !== "1") return 1;
      return baseA.localeCompare(baseB, undefined, { numeric: true, sensitivity: "base" });
    });

    if (files.length > 0) {
      return files.map((f) => `/${folder.replace(/\\/g, "/")}/${f}`);
    }
  } catch {
    // Fallback if directory read fails
  }
  return [fallback];
}

export default function ShivaApparelPage({ params }: { params: { item: string } }) {
  const product = getApparelProduct(params.item);
  if (!product) return notFound();

  const images = getApparelImages(product.folder, product.featureImage);

  return <ApparelProductView product={product} images={images} />;
}
