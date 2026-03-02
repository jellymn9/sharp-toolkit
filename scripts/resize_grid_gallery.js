import sharp from "sharp";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

const inputArg = args.find((a) => a.startsWith("--input="));
const outputArg = args.find((a) => a.startsWith("--output="));

if (!inputArg || !outputArg) {
  console.error(
    "Usage: node scripts/resize_grid_gallery.js --input=img1.jpg,img2.jpg,img3.jpg --output=./output",
  );
  process.exit(1);
}

const inputFiles = inputArg.split("=")[1].split(",");
const outputDir = outputArg.split("=")[1];

const sizes = [
  { width: 558, height: 502 }, // first image
  { width: 274, height: 247 }, // all other images
];

fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  for (let i = 0; i < inputFiles.length; i++) {
    const inputFile = inputFiles[i].trim();
    const size = i === 0 ? sizes[0] : sizes[1];

    if (!fs.existsSync(inputFile)) {
      console.error(`✗ File not found: ${inputFile}`);
      continue;
    }

    const pathInfo = path.parse(inputFile);
    const outputPath = path.join(
      outputDir,
      `${pathInfo.name}_${size.width}x${size.height}${pathInfo.ext}`,
    );

    try {
      await sharp(inputFile)
        .resize(size.width, size.height, {
          fit: "cover",
          position: "centre",
        })
        .toFile(outputPath);

      console.log(
        `✓ ${path.basename(inputFile)} → ${size.width}x${size.height}`,
      );
    } catch (err) {
      console.error(`✗ ${inputFile}: ${err.message}`);
    }
  }

  console.log("\nDone!");
})();
