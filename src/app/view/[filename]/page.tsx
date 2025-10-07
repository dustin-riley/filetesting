import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import CSVTable from '@/components/CSVTable';

interface PageProps {
  params: Promise<{
    filename: string;
  }>;
}

function getFileType(filename: string): 'pdf' | 'csv' | 'other' {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.csv') return 'csv';
  return 'other';
}

async function fileExists(filename: string): Promise<boolean> {
  const filesDirectory = path.join(process.cwd(), 'public/files');
  const filePath = path.join(filesDirectory, filename);

  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readCSVFile(filename: string): Promise<Record<string, string>[]> {
  const filesDirectory = path.join(process.cwd(), 'public/files');
  const filePath = path.join(filesDirectory, filename);
  const fileContent = await fs.readFile(filePath, 'utf-8');

  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as Record<string, string>[]);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

export default async function ViewFilePage({ params }: PageProps) {
  const { filename } = await params;
  const decodedFilename = decodeURIComponent(filename);

  // Check if file exists
  const exists = await fileExists(decodedFilename);
  if (!exists) {
    notFound();
  }

  const fileType = getFileType(decodedFilename);

  // Handle CSV files
  if (fileType === 'csv') {
    const csvData = await readCSVFile(decodedFilename);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold truncate">{decodedFilename}</h1>
        </div>
        <CSVTable data={csvData} />
      </div>
    );
  }

  // Handle PDF files (and other files with iframe)
  const fileUrl = `/files/${encodeURIComponent(decodedFilename)}`;

  return (
    <div className="container mx-auto px-4 py-8 h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold truncate">{decodedFilename}</h1>
      </div>

      <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
        <iframe
          src={fileUrl}
          className="w-full h-full"
          title={decodedFilename}
        />
      </div>
    </div>
  );
}
