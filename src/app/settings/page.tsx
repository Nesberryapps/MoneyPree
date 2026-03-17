
'use client'

import { SettingsClient } from '@/components/settings/settings-client';

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 p-4 md:p-8">
        <SettingsClient />
      </main>
    </div>
  );
}
