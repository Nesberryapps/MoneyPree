
'use client';

import Link from 'next/link';
import { MoneyPreeIcon } from '../icons';

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
       <Link href="/dashboard/dashboard" className="flex items-center gap-2">
          <MoneyPreeIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">MoneyPree</span>
        </Link>
      <div className="w-full flex-1">
      </div>
    </header>
  );
}
