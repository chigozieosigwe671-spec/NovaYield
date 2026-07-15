import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new
  URL("https://localhost:3000"),
  title: 'NovaYield — AI-Powered Investments for Sustainable Wealth',
  description:
    'NovaYield harnesses the power of artificial intelligence to identify high-potential ventures in agriculture, oil & gas, real estate, and gold & precious metal mining.',
  keywords: ['AI investment', 'investment platform', 'agriculture investment', 'oil and gas', 'gold mining', 'crypto investment'],
  openGraph: {
    title: 'NovaYield — AI-Powered Investments',
    description: 'Harnessing the power of AI for sustainable and profitable investments.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
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
