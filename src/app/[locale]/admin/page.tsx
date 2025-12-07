import { redirect } from 'next/navigation'; // Use native Next.js redirect

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboard({ params }: Props) {
  const { locale } = await params;
  
  // Explicitly construct the URL with the current locale
  redirect(`/${locale}/admin/analytics`);
}