import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center">
          <Link
            href="/"
            className="text-xl font-semibold hover:text-primary transition-colors"
          >
            FileTesting
          </Link>
        </nav>
      </div>
    </header>
  );
}
