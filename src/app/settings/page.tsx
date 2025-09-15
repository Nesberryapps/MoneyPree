import { Header } from '@/components/layout/header';
import { SettingsClient } from '@/components/settings/settings-client';

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Settings" />
      <main className="flex-1 p-4 md:p-8">
        <SettingsClient />
      </main>
    </div>
  );
}
