
'use client';

import Link from 'next/link';
import { MoneyPreeIcon } from '../icons';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
       <Link href="/dashboard/dashboard" className="flex items-center gap-2">
          <MoneyPreeIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">MoneyPree</span>
        </Link>
      <div className="w-full flex-1">
      </div>
    </header>
  );
}
