// app/admin/layout.tsx
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex'>
      <aside className='w-64 bg-gray-900 text-white p-4'>
        <h2 className='text-xl font-bold mb-6'>Админка 🍕</h2>
        <nav className='space-y-2'>
          <Link href='/admin/users'>Пользователи</Link>
          <Link href='/admin/orders'>Заказы</Link>
          <Link href='/admin/products'>Продукты</Link>
        </nav>
      </aside>
      <main className='flex-1 p-6 bg-gray-100'>{children}</main>
    </div>
  );
}
