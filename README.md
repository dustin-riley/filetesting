# FileTesting

A modern file viewer application built with Next.js that provides seamless viewing of PDF and CSV files stored in Vercel Blob Storage.

## Features

- **PDF Viewer**: View PDF documents with a server-side proxy for proper rendering and security
- **Interactive CSV Viewer**:
  - Sortable columns (ascending/descending)
  - Per-column filtering
  - Clean, responsive table interface
- **Vercel Blob Storage Integration**: Dynamic file listing with automatic updates
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS v4
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Force Dynamic Rendering**: Real-time file updates without redeployment

## Tech Stack

- **Framework**: [Next.js 15.5.4](https://nextjs.org) with App Router
- **Runtime**: [React 19.1.0](https://react.dev)
- **Language**: [TypeScript 5](https://www.typescriptlang.org)
- **Build Tool**: [Turbopack](https://turbo.build/pack)
- **Storage**: [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) v2.0.0
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives)
- **CSV Parsing**: [PapaParse](https://www.papaparse.com) v5.5.3
- **Table Library**: [TanStack Table](https://tanstack.com/table) v8.21.3

## Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- A Vercel account with Blob Storage enabled

## Environment Setup

This application requires a Vercel Blob Storage token to function.

1. **Get your Blob Storage token**:
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Storage → Create → Blob
   - Copy your `BLOB_READ_WRITE_TOKEN`

2. **Configure environment variables**:
   - Create a `.env.local` file in the root directory
   - Add your token:
     ```env
     BLOB_READ_WRITE_TOKEN=your_token_here
     ```

See `.env.example` for reference.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd filetesting
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Add your `BLOB_READ_WRITE_TOKEN`

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Uploading Files

To add files to the application, upload them to your Vercel Blob Storage:

1. Use the [Vercel Dashboard](https://vercel.com/dashboard) to upload files via the UI
2. Or use the Vercel CLI:
   ```bash
   vercel blob upload <file-path>
   ```
3. Or integrate the [@vercel/blob](https://www.npmjs.com/package/@vercel/blob) SDK programmatically

### Supported File Types

- **PDF** (`.pdf`): Viewed in an embedded iframe with server-side proxy
- **CSV** (`.csv`): Displayed in an interactive, sortable, filterable table

### Viewing Files

1. Navigate to the home page to see all uploaded files
2. Files are displayed as cards showing:
   - Filename
   - File type badge (PDF/CSV)
   - Last modified date
3. Click "View File" to open the file viewer
4. For CSV files: Use column headers to sort and filter data

## Project Structure

```
filetesting/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── pdf/[filename]/    # PDF proxy API route
│   │   │       └── route.ts
│   │   ├── view/[filename]/       # Dynamic file viewer page
│   │   │   └── page.tsx
│   │   ├── layout.tsx             # Root layout with Header/Footer
│   │   ├── page.tsx               # Home page with file listing
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── CSVTable.tsx           # Interactive CSV table component
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── utils.ts               # Utility functions
├── public/
│   └── files/                     # Legacy local files (MVP only)
├── .env.local                     # Environment variables (not in git)
├── .env.example                   # Environment variables template
└── package.json
```

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Key Implementation Details

#### Force Dynamic Rendering

The home page uses `export const dynamic = 'force-dynamic'` to ensure newly uploaded files appear immediately without requiring a redeploy.

#### PDF Proxy

PDFs are served through a Next.js API route (`/api/pdf/[filename]`) that:
- Fetches the file from Vercel Blob Storage
- Proxies it through the application domain
- Sets proper headers for inline viewing and caching

This approach ensures PDFs render correctly in iframes without CORS issues.

#### CSV Parsing

CSV files are:
1. Fetched from Blob Storage
2. Parsed server-side using PapaParse
3. Rendered client-side using TanStack Table with sorting and filtering

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Configure environment variables**:
   - Add `BLOB_READ_WRITE_TOKEN` in Project Settings → Environment Variables
   - Or Vercel will automatically provide it if you create Blob Storage through their dashboard

4. **Deploy**:
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

### Environment Variables in Production

Ensure `BLOB_READ_WRITE_TOKEN` is set in your Vercel project settings. This is required for the application to read and serve files from Blob Storage.

## License

[Add your license here]

## Contributing

[Add contribution guidelines if applicable]
