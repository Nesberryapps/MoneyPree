
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { MoneyWizeIcon } from '../icons';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '../auth/auth-provider';

export function Header() {
  const userAvatarImage = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
       <Link href="/dashboard" className="flex items-center gap-2">
          <MoneyWizeIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">MoneyWize</span>
        </Link>
      <div className="w-full flex-1">
      </div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user.isAnonymous ? undefined : user.photoURL || userAvatarImage?.imageUrl} data-ai-hint={userAvatarImage?.imageHint} />
                <AvatarFallback>{user.isAnonymous ? 'G' : user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.isAnonymous ? 'Guest Account' : 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help">Support</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <AuthProvider />
      )}
    </header>
  );
}
