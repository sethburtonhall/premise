#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";

// Parse command line arguments
const args = process.argv.slice(2);
const sourceImage = args[0] || "public/crosshair_icon.svg";
const outputDir = args[1] || "public";

// Configuration
const CONFIG = {
  sourceLogo: sourceImage,
  outputDir: outputDir,
  sizes: {
    favicon: 16,
    "favicon-32x32": 32,
    "apple-touch-icon": 180,
    "android-chrome-192x192": 192,
    "android-chrome-512x512": 512,
  },
  pwaSizes: [192, 512],
};

// Helper function to resize image
async function resizeImage(sourcePath, outputPath, size) {
  try {
    // Read the source image
    const img = await loadImage(sourcePath);

    // Create canvas with target size
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    // Draw image centered and scaled
    const scale = Math.min(size / img.width, size / img.height);
    const x = (size - img.width * scale) / 2;
    const y = (size - img.height * scale) / 2;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // Save the image
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);

    console.log(`Generated: ${outputPath} (${size}x${size})`);
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error.message);
  }
}

// Generate favicon.ico (requires special handling)
async function generateFavicon(sourcePath, outputPath) {
  try {
    // For favicon.ico, we'll create a 32x32 PNG and rename it
    // In a real implementation, you'd want to use a proper ICO generator
    await resizeImage(sourcePath, outputPath.replace(".ico", ".png"), 32);

    // For now, we'll create a simple 16x16 favicon
    await resizeImage(sourcePath, outputPath.replace(".ico", "-16.png"), 16);

    console.log(
      `Generated favicon files (PNG format - convert to ICO if needed)`,
    );
  } catch (error) {
    console.error(`Error generating favicon:`, error.message);
  }
}

// Generate PWA manifest icons
function generateManifest() {
  const manifest = {
    name: "Premise",
    short_name: "Premise",
    description: "Technical scope generation for design agencies",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  const manifestPath = path.join(CONFIG.outputDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Generated: ${manifestPath}`);
}

// Show help
function showHelp() {
  console.log(`
Usage: npm run generate-icons [source-image] [output-directory]

Arguments:
  source-image    Path to source image (PNG, JPG, or SVG) - default: public/logo-light.png
  output-directory Directory to save generated icons - default: public

Examples:
  npm run generate-icons
  npm run generate-icons public/logo.svg
  npm run generate-icons assets/my-logo.svg public/icons
  npm run generate-icons public/logo-dark.png public

Supported formats: PNG, JPG, SVG
`);
}

// Main function
async function main() {
  // Show help if requested
  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    return;
  }

  console.log(`Generating logos and PWA icons from: ${CONFIG.sourceLogo}`);

  const sourcePath = path.resolve(CONFIG.sourceLogo);
  const outputDir = path.resolve(CONFIG.outputDir);

  // Check if source logo exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source logo not found: ${sourcePath}`);
    console.log("\nUse --help for usage information");
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate all icon sizes
  for (const [name, size] of Object.entries(CONFIG.sizes)) {
    const outputPath = path.join(outputDir, `${name}.png`);
    await resizeImage(sourcePath, outputPath, size);
  }

  // Generate favicon
  await generateFavicon(sourcePath, path.join(outputDir, "favicon.ico"));

  // Generate PWA manifest
  generateManifest();

  console.log("\nIcon generation complete!");
  console.log(`Icons saved to: ${outputDir}`);
  console.log("\nNote: favicon.ico was generated as PNG files.");
  console.log(
    "You may need to convert favicon-32.png to actual ICO format using an online tool or additional library.",
  );
}

// Handle errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Run the script
main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
