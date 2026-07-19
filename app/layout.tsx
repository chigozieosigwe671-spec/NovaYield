import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'NovaYield — AI-Powered Investments for Sustainable Wealth',
  description:
    'NovaYield harnesses the power of artificial intelligence to identify high-potential ventures in agriculture, oil & gas, real estate, and gold & precious metal mining.',
  keywords: ['AI investment', 'investment platform', 'agriculture investment', 'oil and gas', 'gold mining', 'crypto investment'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'NovaYield — AI-Powered Investments',
    description: 'Harnessing the power of AI for sustainable and profitable investments.',
    type: 'website',
     images: [
    {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "NovaYield",
    },
  ],
  }, 
  twitter: {
  card: "summary_large_image",
  images: ["/og-image.jpg"],
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${jakarta.variable} ${sora.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
