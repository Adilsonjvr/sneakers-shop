import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'High-Cost Sneakers',
  description: 'Showroom premium de drops Air Jordan com experiência imersiva.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-neutral-950 text-neutral-50`}>
        {children}
      </body>
    </html>
  );
}
