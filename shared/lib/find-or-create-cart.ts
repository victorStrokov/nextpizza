import { prisma } from '@/prisma/prisma-client';
// /**
//  * Функция для поиска или создания корзины
//  * @param token // токен
//  * @returns // возвращаем корзину
//  */
export const findOrCreateCart = async (token: string) => {
  let userCart = await prisma.cart.findFirst({
    // ищем корзину по токену
    where: {
      token,
    },
  });

  if (!userCart) {
    // если корзина не нашлась тогда создаем
    userCart = await prisma.cart.create({
      data: {
        token,
      },
    });
  }

  return userCart;
};
