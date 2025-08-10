import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-sesion';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getUserSession(); // проверяем авторизацию
    if (!user) {
      return NextResponse.json(
        { message: '[USER_GET] Пользователь не авторизован' },
        { status: 401 }
      );
    }
    // если сессия вернула пользователя находим его по id
    const data = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
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
