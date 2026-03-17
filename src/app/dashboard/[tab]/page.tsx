
import { NAV_LINKS } from '@/lib/constants';
import DashboardContent from './DashboardContent';

export async function generateStaticParams() {
  // Generate static paths for all the dashboard tabs
  return NAV_LINKS.map((link) => ({
    tab: link.href.replace('/dashboard/', ''),
  }));
}

export default function DashboardTabPage({ params }: { params: { tab: string } }) {
  // This is a Server Component.
  // It renders the Client Component and passes the 'tab' param to it.
  return <DashboardContent tab={params.tab} />;
}
