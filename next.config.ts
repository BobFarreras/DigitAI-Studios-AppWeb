// ✅ CORRECTE: Import per defecte (sense claus { })
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configs opcionals de Next.js
};

export default withNextIntl(nextConfig);