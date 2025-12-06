import { redirect } from '@/routing';

export default function AdminDashboard({ params }: { params: { locale: string } }) {
  redirect({
    href: '/admin/analytics',
    locale: params.locale,
  });
}
