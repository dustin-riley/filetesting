import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://filetesting.dustinriley.com';

// Create the PDF document
const doc = new PDFDocument({ margin: 50 });

// Output path
const outputPath = path.join(process.cwd(), 'public/files/advanced-report.pdf');

// Pipe the PDF to a file
doc.pipe(fs.createWriteStream(outputPath));

// Track page numbers manually
let pageNumber = 1;

// Helper function to add page number
function addPageNumber() {
  const pageString = `Page ${pageNumber} of 7`;
  const currentY = doc.y; // Save current Y position
  doc.fontSize(10).fillColor('#9ca3af');
  doc.text(pageString, 50, doc.page.height - 50, { align: 'center', lineBreak: false });
  doc.y = currentY; // Restore Y position to prevent page break
  pageNumber++;
}

// Helper function to draw a table
function drawTable(
  doc: PDFKit.PDFDocument,
  headers: string[],
  rows: string[][],
  columnWidths: number[],
  startY: number
) {
  const tableX = 50;
  let currentY = startY;
  const rowHeight = 25;
  const cellPadding = 5;

  // Draw header row
  doc.fillColor('#2563eb').rect(tableX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight).fill();

  doc.fillColor('white').fontSize(11).font('Helvetica-Bold');
  headers.forEach((header, i) => {
    const x = tableX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
    doc.text(header, x + cellPadding, currentY + cellPadding, { width: columnWidths[i] - cellPadding * 2 });
  });

  currentY += rowHeight;

  // Draw data rows
  doc.fillColor('black').font('Helvetica').fontSize(10);
  rows.forEach((row, rowIndex) => {
    const isEven = rowIndex % 2 === 0;
    if (isEven) {
      doc.fillColor('#f3f4f6').rect(tableX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight).fill();
    }

    doc.fillColor('black');
    row.forEach((cell, i) => {
      const x = tableX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(cell, x + cellPadding, currentY + cellPadding, { width: columnWidths[i] - cellPadding * 2 });
    });

    currentY += rowHeight;
  });

  // Draw table border
  doc.strokeColor('#d1d5db').lineWidth(1);
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
  const totalHeight = rowHeight * (rows.length + 1);
  doc.rect(tableX, startY, totalWidth, totalHeight).stroke();

  // Draw column separators
  let x = tableX;
  columnWidths.forEach((width, i) => {
    if (i > 0) {
      doc.moveTo(x, startY).lineTo(x, startY + totalHeight).stroke();
    }
    x += width;
  });

  return currentY;
}

// Helper function to draw a note box
function drawNoteBox(doc: PDFKit.PDFDocument, title: string, content: string, y: number, type: 'info' | 'warning' = 'info') {
  const boxX = 50;
  const boxWidth = 495;
  const boxPadding = 10;
  const color = type === 'info' ? '#dbeafe' : '#fef3c7';
  const borderColor = type === 'info' ? '#2563eb' : '#f59e0b';

  // Calculate box height based on content
  const titleHeight = 20;
  const contentHeight = Math.ceil(doc.heightOfString(content, { width: boxWidth - boxPadding * 2 }));
  const boxHeight = titleHeight + contentHeight + boxPadding * 3;

  // Draw box background
  doc.fillColor(color).rect(boxX, y, boxWidth, boxHeight).fill();

  // Draw left border
  doc.fillColor(borderColor).rect(boxX, y, 4, boxHeight).fill();

  // Draw title
  doc.fillColor('black').fontSize(12).font('Helvetica-Bold');
  doc.text(title, boxX + boxPadding + 4, y + boxPadding, { width: boxWidth - boxPadding * 2 });

  // Draw content
  doc.fontSize(10).font('Helvetica');
  doc.text(content, boxX + boxPadding + 4, y + boxPadding + titleHeight, { width: boxWidth - boxPadding * 2 });

  return y + boxHeight;
}

// Store page references for TOC
const pageRefs: { [key: string]: number } = {};

// COVER PAGE
doc.fontSize(32).font('Helvetica-Bold').fillColor('#1f2937');
doc.text('Comprehensive Business Report v2', { align: 'center' });
doc.moveDown();

doc.fontSize(16).font('Helvetica').fillColor('#6b7280');
doc.text('2024 Annual Analysis & Insights', { align: 'center' });
doc.moveDown(3);

doc.fontSize(12).fillColor('#9ca3af');
doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });

addPageNumber(); // Add page number to cover page

doc.addPage();

// TABLE OF CONTENTS
pageRefs['toc'] = 2;
doc.fontSize(24).font('Helvetica-Bold').fillColor('#1f2937');
doc.text('Table of Contents', { underline: true });
doc.moveDown(2);

doc.fontSize(12).font('Helvetica');
const tocItems = [
  { title: '1. Introduction', page: 3 },
  { title: '  1.1 Overview', page: 3 },
  { title: '  1.2 Methodology', page: 3 },
  { title: '2. Data Analysis', page: 4 },
  { title: '  2.1 Employee Statistics', page: 4 },
  { title: '  2.2 Department Breakdown', page: 5 },
  { title: '3. Notes & Observations', page: 6 },
  { title: '4. References', page: 7 },
];

tocItems.forEach(item => {
  doc.fillColor('#2563eb').text(item.title, { continued: true, link: `#page${item.page}` });
  doc.fillColor('#6b7280').text(` ..................... ${item.page}`, { align: 'right' });
  doc.moveDown(0.5);
});

addPageNumber(); // Add page number to TOC page

// SECTION 1: INTRODUCTION
doc.addPage()
pageRefs['section1'] = 3;

doc.outline.addItem('Introduction');

doc.fontSize(20).font('Helvetica-Bold').fillColor('#1f2937');
doc.text('1. Introduction');
doc.moveDown();

// Subsection 1.1
doc.fontSize(16).font('Helvetica-Bold').fillColor('#374151');
doc.text('1.1 Overview');
doc.moveDown(0.5);

doc.fontSize(11).font('Helvetica').fillColor('black');
doc.text('This comprehensive report provides detailed insights into organizational performance, employee metrics, and departmental analysis for the fiscal year 2024. The data presented herein has been compiled from various internal systems and validated for accuracy.');
doc.moveDown();

doc.text('Our analysis encompasses workforce distribution, compensation trends, and departmental efficiency metrics. These insights support strategic decision-making and resource allocation planning.');
doc.moveDown(2);

// Subsection 1.2
doc.fontSize(16).font('Helvetica-Bold').fillColor('#374151');
doc.text('1.2 Methodology');
doc.moveDown(0.5);

doc.fontSize(11).font('Helvetica').fillColor('black');
doc.text('Data collection methodology included:');
doc.moveDown(0.5);

doc.list([
  'Automated extraction from HR management systems',
  'Cross-validation with departmental records',
  'Statistical analysis using industry-standard metrics',
  'Quarterly performance review integration'
]);

addPageNumber(); // Add page number to Section 1

// SECTION 2: DATA ANALYSIS
doc.addPage()
pageRefs['section2'] = 4;

doc.outline.addItem('Data Analysis');

doc.fontSize(20).font('Helvetica-Bold').fillColor('#1f2937');
doc.text('2. Data Analysis');
doc.moveDown(2);

// Subsection 2.1
doc.fontSize(16).font('Helvetica-Bold').fillColor('#374151');
doc.text('2.1 Employee Statistics');
doc.moveDown();

doc.fontSize(11).font('Helvetica').fillColor('black');
doc.text('The following table summarizes key employee statistics across all departments:');
doc.moveDown();

// Add a note annotation explaining salary calculation
doc.note(
  400,
  doc.y,
  100,
  20,
  'Salary calculations: Average salaries are computed using the median of all employee salaries within each department to avoid outlier bias. Data sourced from payroll system as of Q4 2024.'
);

const statsTable = [
  ['Engineering', '4', '$91,250', '2020-06-20'],
  ['Marketing', '2', '$76,500', '2021-05-21'],
  ['Sales', '2', '$92,500', '2020-08-15'],
  ['HR', '1', '$65,000', '2021-09-30'],
  ['Finance', '1', '$72,000', '2022-02-14'],
];

const currentY = drawTable(
  doc,
  ['Department', 'Headcount', 'Avg. Salary', 'Avg. Tenure'],
  statsTable,
  [140, 100, 120, 135],
  doc.y
);

doc.y = currentY + 20;

addPageNumber(); // Add page number to Section 2.1

// SECTION 2.2
doc.addPage()

doc.fontSize(16).font('Helvetica-Bold').fillColor('#374151');
doc.text('2.2 Department Breakdown');
doc.moveDown();

doc.fontSize(11).font('Helvetica').fillColor('black');
doc.text('Detailed breakdown of department composition and role distribution:');
doc.moveDown();

const deptTable = [
  ['Engineering', 'Senior Developer', '1', '$95,000'],
  ['Engineering', 'DevOps Engineer', '1', '$90,000'],
  ['Engineering', 'Frontend Dev', '1', '$88,000'],
  ['Engineering', 'Backend Dev', '1', '$92,000'],
  ['Marketing', 'Manager', '1', '$85,000'],
  ['Marketing', 'Content Specialist', '1', '$68,000'],
  ['Sales', 'Director', '1', '$110,000'],
  ['Sales', 'Account Executive', '1', '$75,000'],
];

const currentY2 = drawTable(
  doc,
  ['Department', 'Role', 'Count', 'Salary'],
  deptTable,
  [130, 150, 80, 135],
  doc.y
);

doc.y = currentY2 + 20;

addPageNumber(); // Add page number to Section 2.2

// SECTION 3: NOTES & OBSERVATIONS
doc.addPage()
pageRefs['section3'] = 6;

doc.outline.addItem('Notes & Observations');

doc.fontSize(20).font('Helvetica-Bold').fillColor('#1f2937');
doc.text('3. Notes & Observations');
doc.moveDown(2);

// Info Note
doc.y = drawNoteBox(
  doc,
  'Key Insight',
  'Engineering department shows the highest average salary at $91,250, reflecting competitive compensation for technical roles. This aligns with industry standards and supports our talent retention strategy.',
  doc.y,
  'info'
) + 15;

// Warning Note
doc.y = drawNoteBox(
  doc,
  'Action Required',
  'HR department currently has only one employee. Consider expanding this team to support growing organizational needs, particularly in recruitment and employee development initiatives.',
  doc.y,
  'warning'
) + 15;

// Another Info Note
const noteBoxY = doc.y;
doc.y = drawNoteBox(
  doc,
  'Observation',
  'Average employee tenure is approximately 2.5 years, indicating stable workforce retention. This metric has improved 15% year-over-year.',
  doc.y,
  'info'
) + 15;

// Add PDF note annotation with historical context
doc.note(
  450,
  noteBoxY + 10,
  100,
  20,
  'Historical Data: Employee retention has steadily improved over the past 3 years. 2022: 2.1 years avg, 2023: 2.3 years avg, 2024: 2.5 years avg. Target for 2025 is 2.8 years.'
);

addPageNumber(); // Add page number to Section 3

// SECTION 4: REFERENCES
doc.addPage()
pageRefs['section4'] = 7;

doc.outline.addItem('References');

doc.fontSize(20).font('Helvetica-Bold').fillColor('#1f2937');
doc.text('4. References');
doc.moveDown(2);

doc.fontSize(12).font('Helvetica').fillColor('black');
doc.text('Data Sources:');
doc.moveDown();

doc.fontSize(11);
doc.text('• Internal HR Management System (HRMS)');
doc.text('• Departmental Performance Records');
doc.text('• Quarterly Review Summaries');
doc.moveDown(2);

doc.text('For detailed employee data, please refer to:');
doc.moveDown();

const csvLinkY = doc.y;
doc.fontSize(12).fillColor('#2563eb');
doc.text('Employee Data CSV', {
  link: `${BASE_URL}/view/sample-data.csv`,
  underline: true,
});

doc.fontSize(10).fillColor('#6b7280');
doc.text('(Click to view interactive table with sorting and filtering)');

// Add note annotation about the CSV data
doc.note(
  450,
  csvLinkY,
  100,
  20,
  'The CSV contains live data synchronized from the HRMS. Click the link to access an interactive table where you can sort by any column and filter records in real-time.'
);

addPageNumber(); // Add page number to Section 4

// Finalize the PDF
doc.end();

console.log(`Advanced PDF generated successfully at: ${outputPath}`);
