import { NextRequest, NextResponse } from 'next/server';
import { head } from '@vercel/blob';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);

    // Get the blob metadata
    const blob = await head(decodedFilename);

    if (!blob) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Fetch the PDF content from the blob URL
    const response = await fetch(blob.url);

    if (!response.ok) {
      return new NextResponse('Failed to fetch file', { status: 500 });
    }

    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${decodedFilename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error proxying PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
