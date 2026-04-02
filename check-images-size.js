const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    let totalSize = 0;
    let imageCount = 0;
    let largeImages = [];
    let byExtension = {};

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
                const size = stat.size;
                totalSize += size;
                imageCount++;

                // Contar por extensión
                byExtension[ext] = (byExtension[ext] || 0) + 1;

                // Marcar imágenes grandes (> 500KB)
                if (size > 500 * 1024) {
                    largeImages.push({
                        name: file,
                        size: size,
                        sizeFormatted: formatBytes(size)
                    });
                }
            }
        }
    });

    return { totalSize, imageCount, largeImages, byExtension };
}

console.log('📊 Análisis de Imágenes\n');
console.log('═'.repeat(60));

if (!fs.existsSync(IMAGES_DIR)) {
    console.log('❌ No se encontró el directorio de imágenes:', IMAGES_DIR);
    process.exit(1);
}

const analysis = analyzeDirectory(IMAGES_DIR);

console.log(`\n📁 Directorio: ${IMAGES_DIR}`);
console.log(`📸 Total de imágenes: ${analysis.imageCount}`);
console.log(`💾 Tamaño total: ${formatBytes(analysis.totalSize)}`);
console.log(`📊 Tamaño promedio: ${formatBytes(analysis.totalSize / analysis.imageCount)}`);

console.log('\n📋 Por tipo de archivo:');
Object.entries(analysis.byExtension).forEach(([ext, count]) => {
    console.log(`   ${ext}: ${count} archivos`);
});

if (analysis.largeImages.length > 0) {
    console.log(`\n⚠️  Imágenes grandes (> 500KB): ${analysis.largeImages.length}`);
    console.log('═'.repeat(60));
    
    // Ordenar por tamaño descendente
    analysis.largeImages.sort((a, b) => b.size - a.size);
    
    // Mostrar las 10 más grandes
    const top10 = analysis.largeImages.slice(0, 10);
    top10.forEach((img, i) => {
        console.log(`${i + 1}. ${img.name}`);
        console.log(`   Tamaño: ${img.sizeFormatted}`);
    });
    
    if (analysis.largeImages.length > 10) {
        console.log(`\n   ... y ${analysis.largeImages.length - 10} más`);
    }
} else {
    console.log('\n✅ Todas las imágenes están optimizadas (< 500KB)');
}

console.log('\n═'.repeat(60));
console.log('\n💡 Recomendaciones:');

if (analysis.totalSize > 50 * 1024 * 1024) {
    console.log('   🔴 CRÍTICO: El tamaño total es muy alto (> 50MB)');
    console.log('   → Ejecuta: node optimize-images-advanced.js');
} else if (analysis.totalSize > 20 * 1024 * 1024) {
    console.log('   🟡 ADVERTENCIA: El tamaño total es alto (> 20MB)');
    console.log('   → Considera optimizar las imágenes más grandes');
} else {
    console.log('   🟢 El tamaño total está en un rango aceptable');
}

if (analysis.largeImages.length > 0) {
    console.log(`   → ${analysis.largeImages.length} imágenes necesitan optimización`);
}

const webpCount = analysis.byExtension['.webp'] || 0;
const totalImages = analysis.imageCount;
const webpPercentage = (webpCount / totalImages * 100).toFixed(1);

if (webpPercentage < 50) {
    console.log(`   → Solo ${webpPercentage}% de las imágenes son WebP`);
    console.log('   → Convierte más imágenes a WebP para mejor rendimiento');
}

console.log('\n');
