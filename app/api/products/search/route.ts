import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') || '';

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query, // ищем по введеннам символам
        mode: 'insensitive', // чувствительность к регистру
      },
    },
    take: 5, // возвращаем только 5 продуктов
  });

  return NextResponse.json(products); // возвращаем продукты получаем данные
}
//http://localhost:3000/api/products/search?query=сар проверяем в браузере поиск
