import { ChooseProductModal } from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      ingredients: true,
      items: true,
    },
  }); // с помощью призма получаем первый продукт по условию для отображения на отдельной странице

  if (!product) {
    return notFound();
  }

  return <ChooseProductModal product={product} />;
}

// страница товара выводится отдельно
