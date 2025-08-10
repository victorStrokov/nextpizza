import { prisma } from '@/prisma/prisma-client';
import { authOptions } from '@/shared/constants/auth-options';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // чтобы не кэшировался запрос

export async function GET(req: any, res: any) {
  try {
    const user = await getServerSession(req, res, authOptions); // проверяем авторизацию

    if (!user) {
      return NextResponse.json(
        { message: '[USER_GET] Пользователь не авторизован' },
        { status: 401 }
      );
    }
    // если сессия вернула пользователя находим его по id
    const data = await prisma.user.findUnique({
      where: {
        id: Number(user.user.id),
      },
      // вытаскиваем из базы данных его данные
      select: {
        fullName: true,
        email: true,
        password: false,
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching user session:', error);
    return NextResponse.json(
      { message: '[USER_GET] Не удалось получить информацию о пользователе' },
      { status: 500 }
    );
  }
}
