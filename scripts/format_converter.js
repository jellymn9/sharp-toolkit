import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "fs";
import { join, extname, basename } from "path";

const args = process.argv.slice(2);

const inputArg = args.find((a) => a.startsWith("--input="));
const outputArg = args.find((a) => a.startsWith("--output="));
const formatArg = args.find((a) => a.startsWith("--format="));

if (!inputArg || !outputArg || !formatArg) {
  console.error(
    "Usage: node scripts/convert.js --input=./input --output=./output --format=webp",
  );
  console.error("Supported formats: jpg, webp, avif, tiff");
  process.exit(1);
}

const inputDir = inputArg.split("=")[1];
const outputDir = outputArg.split("=")[1];
const format = formatArg.split("=")[1];

const supportedFormats = ["jpg", "webp", "avif", "tiff"];
const supportedInputExts = [".jpg", ".webp", ".avif", ".tiff"];

if (!supportedFormats.includes(format)) {
  console.error(
    `Unsupported format: ${format}. Use one of: ${supportedFormats.join(", ")}`,
  );
  process.exit(1);
}

if (!existsSync(inputDir)) {
  console.error(`Input directory does not exist: ${inputDir}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const files = readdirSync(inputDir).filter((f) =>
  supportedInputExts.includes(extname(f).toLowerCase()),
);

if (files.length === 0) {
  console.log("No supported images found in input directory.");
  process.exit(0);
}

(async () => {
  for (const file of files) {
    const inputPath = join(inputDir, file);
    const baseName = basename(file, extname(file));
    const outputPath = join(outputDir, `${baseName}.${format}`);

    try {
      await sharp(inputPath).toFormat(format).toFile(outputPath);
      console.log(`✓ ${file} → ${baseName}.${format}`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone! Converted ${files.length} image(s) to ${format}.`);
})();
