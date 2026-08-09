const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generatePdf(data, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Title
      doc.fontSize(24).fillColor('#4F46E5').text('StartupForge AI Analysis Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#64748B').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(1.5);

      // Idea Section
      doc.fontSize(12).fillColor('#0F172A').text('Startup Idea:', { underline: true });
      doc.fontSize(11).fillColor('#334155').text(data.idea || 'N/A');
      doc.moveDown(1.5);

      const sections = [
        { title: 'Market Analysis', value: data.market },
        { title: 'Competitor Analysis', value: data.competitors },
        { title: 'SWOT Analysis', value: data.swot },
        { title: 'Business Model', value: data.business_model },
        { title: 'MVP Roadmap', value: data.mvp },
        { title: 'Startup Score', value: data.score },
        { title: 'Revenue Forecast', value: data.revenue },
        { title: 'Pitch Deck', value: data.pitch },
      ];

      for (const section of sections) {
        if (!section.value) continue;

        doc.fontSize(14).fillColor('#4F46E5').text(section.title);
        doc.moveDown(0.2);

        if (typeof section.value === 'object') {
          for (const [key, val] of Object.entries(section.value)) {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

            if (Array.isArray(val)) {
              doc.fontSize(11).fillColor('#0F172A').text(`  ${formattedKey}:`);
              for (const item of val) {
                if (typeof item === 'object') {
                  const details = [];
                  for (const [k, v] of Object.entries(item)) {
                    const formattedK = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    if (Array.isArray(v)) {
                      details.push(`${formattedK}: ${v.join(', ')}`);
                    } else {
                      details.push(`${formattedK}: ${v}`);
                    }
                  }
                  doc.fontSize(10).fillColor('#334155').text(`    • ${details.join(' | ')}`);
                } else {
                  doc.fontSize(10).fillColor('#334155').text(`    • ${item}`);
                }
              }
            } else if (typeof val === 'object' && val !== null) {
              doc.fontSize(11).fillColor('#0F172A').text(`  ${formattedKey}:`);
              for (const [k, v] of Object.entries(val)) {
                const formattedK = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                doc.fontSize(10).fillColor('#334155').text(`    - ${formattedK}: ${v}`);
              }
            } else {
              doc.fontSize(11).fillColor('#0F172A').text(`  ${formattedKey}: ` + val);
            }
          }
        } else {
          doc.fontSize(11).fillColor('#334155').text(String(section.value));
        }
        doc.moveDown(1);
      }

      doc.end();
      writeStream.on('finish', () => resolve(outputPath));
      writeStream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePdf };
