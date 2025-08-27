// app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/constants/auth-options';
import { redirect } from 'next/navigation';

export default async function AdminHome() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div>
      <h1 className='text-2xl font-bold'>Добро пожаловать в админку</h1>
      <p className='mt-2 text-gray-600'>Выберите раздел слева</p>
    </div>
  );
}
