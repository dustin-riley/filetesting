import { notFound } from 'next/navigation';
import path from 'path';
import { head } from '@vercel/blob';
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

async function getBlobUrl(filename: string): Promise<string | null> {
  try {
    const blob = await head(filename);
    return blob?.url || null;
  } catch {
    return null;
  }
}

async function readCSVFile(blobUrl: string): Promise<Record<string, string>[]> {
  // Fetch the CSV content from the blob URL
  const response = await fetch(blobUrl);
  const fileContent = await response.text();

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

  // Get blob URL for the file
  const blobUrl = await getBlobUrl(decodedFilename);
  if (!blobUrl) {
    notFound();
  }

  const fileType = getFileType(decodedFilename);

  // Handle CSV files
  if (fileType === 'csv') {
    const csvData = await readCSVFile(blobUrl);

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
  // Use API route to proxy PDF from our domain so relative URLs work
  const pdfUrl = `/api/pdf/${encodeURIComponent(decodedFilename)}`;

  return (
    <div className="container mx-auto px-4 py-8 h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold truncate">{decodedFilename}</h1>
      </div>

      <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title={decodedFilename}
        />
      </div>
    </div>
  );
}
