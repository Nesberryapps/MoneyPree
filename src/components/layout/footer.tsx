import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 border-t">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MoneyPree. All rights reserved.</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About Us
          </Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            Blog
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
