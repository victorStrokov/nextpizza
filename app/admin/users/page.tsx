import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/constants/auth-options';

import { redirect } from 'next/navigation';

import { prisma } from '@/prisma/prisma-client';

interface Props {
  searchParams?: {
    search?: string;
  };
}

export default async function UsersPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const search = searchParams?.search?.toLowerCase() || '';
  // Получаем всех пользователей из базы данных

  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: search, // передаётся из формы
        mode: 'insensitive',
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Пользователи</h1>

      <form
        method='get'
        className='mb-4'>
        <input
          type='text'
          name='search'
          placeholder='Поиск по email...'
          defaultValue={search}
          className='border px-3 py-2 rounded w-64'
        />
        <button
          type='submit'
          className='ml-2 px-4 py-2 bg-blue-600 text-white rounded'>
          Найти
        </button>
      </form>

      <table className='w-full bg-white shadow rounded overflow-hidden'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='p-2 text-left'>Имя</th>
            <th className='p-2 text-left'>Email</th>
            <th className='p-2 text-left'>Роль</th>
            <th className='p-2 text-left'>Статус</th>
            <th className='p-2 text-left'>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className='border-t'>
              <td className='p-2'>{user.fullName}</td>
              <td className='p-2'>{user.email}</td>
              <td className='p-2'>{user.role}</td>
              <td className='p-2'>
                {user.verified ? '✅ Подтверждён' : '❌ Не подтверждён'}
              </td>
              <td className='p-2 space-x-2'>
                <button className='text-blue-600 hover:underline'>
                  Редактировать
                </button>
                <button className='text-red-600 hover:underline'>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
