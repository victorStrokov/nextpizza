import { Header } from '@/shared/components/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Next Pizza | Главная',
};

export default function HomeLayout({
  children,
  modal, //  modal потому что есть папка @modal - слот для модалки
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode; // типизируем модал
}>) {
  return (
    <main className='min-h-screen'>
      <Suspense>
        <Header />
      </Suspense>
      {children}
      {modal}
    </main>
  );
}
