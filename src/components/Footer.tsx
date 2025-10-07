export default function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} FileTesting
        </p>
      </div>
    </footer>
  );
}
