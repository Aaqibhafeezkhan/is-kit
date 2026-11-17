import type { Metadata, Viewport } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import '@/app/globals.css';
import type { Locale } from '@/constants/i18n';
import { SiteHeader } from '@/components/navigation/site-header';
import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { apiSections } from '@/constants/api-catalog';
import { guideSections } from '@/constants/guides';
import {
  SITE_DESCRIPTION,
  SITE_OPEN_GRAPH,
  SITE_SOCIAL_IMAGE,
  SITE_TITLE,
  SITE_URL
} from '@/constants/site';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: { url: '/iskit_favicon.png', type: 'image/png', sizes: '192x192' }
  },
  openGraph: {
    ...SITE_OPEN_GRAPH,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_SOCIAL_IMAGE]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export function RootLayout({
  children,
  lang
}: {
  children: React.ReactNode;
  lang: Locale;
}) {
  return (
    <html lang={lang} suppressHydrationWarning className={sourceSans3.variable}>
      <body className='antialiased'>
        <SiteHeader />
        <SidebarLayout sections={[...apiSections, ...guideSections]}>
          <main className='w-full max-w-full overflow-x-hidden pt-14'>
            {children}
          </main>
        </SidebarLayout>
      </body>
    </html>
  );
}
