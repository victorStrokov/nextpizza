import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
  const ingredients = await prisma.ingredient.findMany(); // получаем все ингредиенты с бд

  return NextResponse.json(ingredients); // возвращаем ингредиент пользователю
}
