import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Create the PDF document
const doc = new PDFDocument();

// Output path
const outputPath = path.join(process.cwd(), 'public/files/sample-report.pdf');

// Pipe the PDF to a file
doc.pipe(fs.createWriteStream(outputPath));

// Add content
doc
  .fontSize(24)
  .text('Employee Data Report', { align: 'center' })
  .moveDown();

doc
  .fontSize(12)
  .text('This is a sample PDF report generated to demonstrate linking capabilities.', {
    align: 'left',
  })
  .moveDown();

doc
  .text('This report contains employee information from our HR database.', {
    align: 'left',
  })
  .moveDown();

doc
  .text('To view the detailed employee data in an interactive table format, please click the link below:')
  .moveDown();

// Add clickable link - this is a relative URL that will work in the webapp
const linkText = 'Click here to view the Employee Data CSV';
const csvUrl = '/view/sample-data.csv'; // Relative URL to the CSV viewer

doc
  .fontSize(14)
  .fillColor('blue')
  .text(linkText, {
    link: csvUrl,
    underline: true,
  })
  .fillColor('black')
  .fontSize(12)
  .moveDown();

doc
  .text('The CSV file contains the following information:')
  .moveDown(0.5);

doc
  .list([
    'Employee Name',
    'Department',
    'Position',
    'Salary',
    'Hire Date'
  ])
  .moveDown();

doc
  .fontSize(10)
  .fillColor('gray')
  .text('Report generated: ' + new Date().toLocaleDateString(), {
    align: 'center',
  });

// Finalize the PDF
doc.end();

console.log(`PDF generated successfully at: ${outputPath}`);
