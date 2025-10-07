import path from 'path';
import Link from 'next/link';
import { list } from '@vercel/blob';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileInfo {
  name: string;
  size: number;
  modifiedDate: string;
  type: 'pdf' | 'csv' | 'other';
}

function getFileType(filename: string): 'pdf' | 'csv' | 'other' {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.csv') return 'csv';
  return 'other';
}

async function getFiles(): Promise<FileInfo[]> {
  try {
    const { blobs } = await list();

    const files: FileInfo[] = blobs.map((blob) => {
      // Extract filename from pathname (e.g., "sample-data.csv")
      const name = blob.pathname;

      return {
        name,
        size: blob.size,
        modifiedDate: new Date(blob.uploadedAt).toLocaleDateString(),
        type: getFileType(name),
      };
    });

    return files;
  } catch (error) {
    console.error('Error listing blob files:', error);
    return [];
  }
}

export default async function Home() {
  const files = await getFiles();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Files</h1>

      {files.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No files found. Upload PDF or CSV files to Vercel Blob Storage to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <Card key={file.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg truncate">{file.name}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium uppercase shrink-0 ${
                    file.type === 'pdf' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                    file.type === 'csv' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {file.type}
                  </span>
                </div>
                <CardDescription>
                  Modified: {file.modifiedDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/view/${encodeURIComponent(file.name)}`}>
                  <Button className="w-full">View File</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
