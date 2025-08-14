import { Nunito } from 'next/font/google';

import './globals.css';

import { Providers } from '@/shared/components/shared/providers';

const nunito = Nunito({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <link
          data-rh='true'
          rel='icon'
          href='/logo.png'
        />
      </head>
      <body className={`${nunito.className} bg-gray-50 text-gray-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
