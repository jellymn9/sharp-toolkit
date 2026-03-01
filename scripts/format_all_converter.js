// scripts/convert-all-formats.js
import sharp from "sharp";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

const inputArg = args.find((a) => a.startsWith("--input="));
const outputArg = args.find((a) => a.startsWith("--output="));

if (!inputArg || !outputArg) {
  console.error(
    "Usage: node scripts/format_all_converter.js --input=./input/image.jpg --output=./output",
  );
  process.exit(1);
}

const inputFile = inputArg.split("=")[1];
const outputDir = outputArg.split("=")[1];

const supportedExts = [".jpg", ".webp", ".avif"];
const outputFormats = ["webp", "avif", "jpg"];

if (!fs.existsSync(inputFile)) {
  console.error(`Input file does not exist: ${inputFile}`);
  process.exit(1);
}

const ext = path.extname(inputFile).toLowerCase();
if (!supportedExts.includes(ext)) {
  console.error(
    `Unsupported input format: ${ext}. Use one of: ${supportedExts.join(", ")}`,
  );
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const baseName = path.basename(inputFile, path.extname(inputFile));

(async () => {
  for (const format of outputFormats) {
    const outputPath = path.join(outputDir, `${baseName}.${format}`);
    try {
      await sharp(inputFile).toFormat(format).toFile(outputPath);
      console.log(`✓ ${baseName}.${format}`);
    } catch (err) {
      console.error(`✗ ${format}: ${err.message}`);
    }
  }

  console.log(
    `\nDone! Produced ${outputFormats.length} formats from ${path.basename(inputFile)}.`,
  );
})();
