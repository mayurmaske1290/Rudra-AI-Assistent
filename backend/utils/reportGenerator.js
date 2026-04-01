const PDFDocument = require('pdfkit');

const generatePdfBuffer = (title, rows = []) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 30 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(18).text(title);
    doc.moveDown();
    rows.forEach((row, i) => doc.fontSize(11).text(`${i + 1}. ${JSON.stringify(row)}`));
    doc.end();
  });

module.exports = { generatePdfBuffer };
