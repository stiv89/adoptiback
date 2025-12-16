const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '../public/adopti_app.jpg');
const outputDir = path.join(__dirname, '../public');

// Tamaños de iconos necesarios para PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  console.log('Generando iconos PWA desde', sourceImage);

  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .toFile(outputFile);
      
      console.log(`✅ Generado: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generando icon-${size}x${size}.png:`, error);
    }
  }

  console.log('✅ Todos los iconos generados exitosamente!');
}

generateIcons().catch(console.error);
