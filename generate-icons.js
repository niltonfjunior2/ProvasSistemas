const sharp = require('sharp');
const path = require('path');

const inputImage = path.join(__dirname, 'public', 'logosis03.png');
const output192 = path.join(__dirname, 'public', 'icon-192x192.png');
const output512 = path.join(__dirname, 'public', 'icon-512x512.png');

async function generateIcons() {
  try {
    // Generate 192x192
    await sharp(inputImage)
      .resize({
        width: 192,
        height: 192,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(output192);
    
    // Generate 512x512
    await sharp(inputImage)
      .resize({
        width: 512,
        height: 512,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(output512);

    console.log('Icons generated successfully.');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
