import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Lora, Mansalva } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

const lora = Lora({ 
  subsets: ['latin'],
  variable: '--font-lora',
});

const mansalva = Mansalva({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mansalva',
});

export const metadata: Metadata = {
  title: 'Nostalgia',
  description: 'Share and preserve your memories together',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${playfair.variable} ${lora.variable} ${mansalva.variable} min-h-screen flex flex-col font-content`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <SiteHeader />
            <main className="flex-1 bg-background">{children}</main>
            <SiteFooter />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}