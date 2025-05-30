const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs').promises;

const QUALITY = 80;
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Image size configurations
const SIZES = {
    mobile: { width: 480, suffix: '-mobile' },
    tablet: { width: 768, suffix: '-tablet' },
    desktop: { width: 1024, suffix: '-desktop' },
    wide: { width: 1440, suffix: '-wide' }
};

async function optimizeImages() {
    try {
        // Get all images in Static/images/assets and its subdirectories
        const images = await new Promise((resolve, reject) => {
            glob('**/*.{jpg,jpeg,png,webp,gif}', {
                cwd: path.join(process.cwd(), 'Static/images/assets'),
                ignore: ['**/*-mobile*', '**/*-tablet*', '**/*-desktop*', '**/*-wide*']
            }, (err, files) => {
                if (err) reject(err);
                else resolve(files);
            });
        });

        console.log(`Found ${images.length} images to process`);

        for (const image of images) {
            const inputPath = path.join(process.cwd(), 'Static/images/assets', image);
            const ext = path.extname(image).toLowerCase();
            const basePath = inputPath.slice(0, -ext.length);
            
            if (!SUPPORTED_FORMATS.includes(ext)) {
                continue;
            }

            // Skip GIF optimization but copy to output
            if (ext === '.gif') {
                // Copy GIF to all size variants
                for (const [size, config] of Object.entries(SIZES)) {
                    const outputPath = `${basePath}${config.suffix}${ext}`;
                    await fs.copyFile(inputPath, outputPath);
                }
                continue;
            }

            // Create different sizes
            for (const [size, config] of Object.entries(SIZES)) {
                // Regular size
                const outputPath = `${basePath}${config.suffix}${ext}`;
                const outputWebP = `${basePath}${config.suffix}.webp`;

                // For WebP source images, only create different sizes in WebP
                if (ext === '.webp') {
                    await sharp(inputPath)
                        .resize(config.width, null, {
                            withoutEnlargement: true,
                            fit: 'inside'
                        })
                        .webp({ quality: QUALITY })
                        .toFile(outputWebP);
                } else {
                    // For non-WebP images, create both original format and WebP
                    await sharp(inputPath)
                        .resize(config.width, null, {
                            withoutEnlargement: true,
                            fit: 'inside'
                        })
                        .jpeg({ quality: QUALITY, progressive: true })
                        .png({ quality: QUALITY, progressive: true })
                        .toFile(outputPath);

                    await sharp(inputPath)
                        .resize(config.width, null, {
                            withoutEnlargement: true,
                            fit: 'inside'
                        })
                        .webp({ quality: QUALITY })
                        .toFile(outputWebP);
                }

                // 2x size for high DPI displays
                const output2xPath = `${basePath}${config.suffix}@2x${ext}`;
                const output2xWebP = `${basePath}${config.suffix}@2x.webp`;

                if (ext === '.webp') {
                    await sharp(inputPath)
                        .resize(config.width * 2, null, {
                            withoutEnlargement: true,
                            fit: 'inside'
                        })
                        .webp({ quality: QUALITY })
                        .toFile(output2xWebP);
                } else {
                    await sharp(inputPath)
                        .resize(config.width * 2, null, {
                            withoutEnlargement: true,
                            fit: 'inside'
                        })
                        .jpeg({ quality: QUALITY, progressive: true })
                        .png({ quality: QUALITY, progressive: true })
                        .toFile(output2xPath);

                    await sharp(inputPath)
                        .resize(config.width * 2, null, {
                            withoutEnlargement: true,
                            fit: 'inside'
                        })
                        .webp({ quality: QUALITY })
                        .toFile(output2xWebP);
                }
            }

            console.log(`Processed: ${image}`);
        }

        console.log('Image optimization complete!');
    } catch (error) {
        console.error('Error optimizing images:', error);
        process.exit(1);
    }
}

// Create package.json if it doesn't exist
async function ensurePackageJson() {
    const packagePath = path.join(process.cwd(), 'package.json');
    try {
        await fs.access(packagePath);
    } catch {
        const packageJson = {
            name: "metro-bank-image-optimization",
            version: "1.0.0",
            private: true,
            scripts: {
                "optimize-images": "node scripts/optimize-images.js"
            },
            dependencies: {
                "sharp": "^0.32.1",
                "glob": "^10.2.2"
            }
        };
        await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
    }
}

// Run the optimization
(async () => {
    await ensurePackageJson();
    await optimizeImages();
})(); 