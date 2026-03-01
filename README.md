# sharp-toolkit

A collection of Node.js scripts for image processing built with [Sharp](https://sharp.pixelplumbing.com/).

## Setup

Make sure you're using the correct Node version:

```bash
nvm use
```

Install dependencies:

```bash
yarn install
```

---

## Scripts

### convert.js

Converts all images in a folder to a specified format.

**Supported formats:** `jpg`, `png`, `webp`, `avif`, `tiff`

```bash
node scripts/convert.js --input=./input --output=./output --format=webp
```

| Argument   | Description                                         |
| ---------- | --------------------------------------------------- |
| `--input`  | Path to folder containing source images             |
| `--output` | Path to folder where converted images will be saved |
| `--format` | Target format to convert all images to              |

---

### convert-all-formats.js

Takes a single image and produces a copy in every supported format.

**Supported formats:** `jpg`, `webp`, `avif`

```bash
node scripts/convert-all-formats.js --input=./input/photo.jpg --output=./output
```

| Argument   | Description                                            |
| ---------- | ------------------------------------------------------ |
| `--input`  | Path to a single source image                          |
| `--output` | Path to folder where all format variants will be saved |

Output files keep the original name with the new extension, e.g. `photo.webp`, `photo.avif`, `photo.jpg`.
