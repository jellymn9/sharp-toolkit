import sharp from "sharp";
import { resolve, join, parse } from "path";
import { existsSync, mkdirSync, readdirSync } from "fs";

const inputDir = resolve("input");
const outputDir = resolve("output");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const mobileSizes = [480, 768];
const desktopSizes = [1024, 1280, 1920];

// portrait ratio for mobile
const mobileHeight = (width) => Math.round(width * 1.5);
// 2:3 portrait ratio (adjust if needed)

async function processImage(file) {
  if (!file.endsWith(".webp")) return;

  const inputPath = join(inputDir, file);
  const fileName = parse(file).name;

  // ======================
  // MOBILE (resize + crop)
  // ======================
  for (const width of mobileSizes) {
    const height = mobileHeight(width);

    const base = sharp(inputPath).resize(width, height, {
      fit: "cover",
      position: "right", // crop from right side
    });

    await base
      .clone()
      .avif({ quality: 60 })
      .toFile(join(outputDir, `${fileName}-${width}-mobile.avif`));

    await base
      .clone()
      .webp({ quality: 80 })
      .toFile(join(outputDir, `${fileName}-${width}-mobile.webp`));

    await base
      .clone()
      .jpeg({ quality: 80 })
      .toFile(join(outputDir, `${fileName}-${width}-mobile.jpg`));

    console.log(`Mobile ${width}px done`);
  }

  // ======================
  // DESKTOP (resize only)
  // ======================
  for (const width of desktopSizes) {
    const base = sharp(inputPath).resize({
      width,
      fit: "inside", // no cropping
      withoutEnlargement: true,
    });

    await base
      .clone()
      .avif({ quality: 60 })
      .toFile(join(outputDir, `${fileName}-${width}.avif`));

    await base
      .clone()
      .webp({ quality: 80 })
      .toFile(join(outputDir, `${fileName}-${width}.webp`));

    await base
      .clone()
      .jpeg({ quality: 80 })
      .toFile(join(outputDir, `${fileName}-${width}.jpg`));

    console.log(`Desktop ${width}px done`);
  }

  console.log(`Finished: ${fileName}`);
}

async function run() {
  const files = readdirSync(inputDir);

  for (const file of files) {
    await processImage(file);
  }

  console.log("All images processed.");
}

run();
