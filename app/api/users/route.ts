import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // SELECT * FROM users WHERE email = 'emasd'
  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const data = await req.json(); // в data вернется обьект который мы создаем и отправляем на сервер

  const user = await prisma.user.create({
    data,
  });

  return NextResponse.json(user); // возвращаем обьект пользователя
}
