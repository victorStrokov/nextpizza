import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findOrCreateCart } from '@/shared/lib/find-or-create-cart';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { updateCartTotalAmount } from '@/shared/lib/update-cart-total-amount';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] }); // если нет токена, то возвращаем пустую корзину
    }
    // после получения информации о корзине возвращаем ее
    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          {
            token,
          },
        ],
      },
      include: {
        // берем все товары из корзины
        items: {
          orderBy: {
            // отсортируем товары по createdAt от первых до последних добавленных
            createdAt: 'desc',
          },
          include: {
            productItem: {
              // верни информацию о продукте
              include: {
                // и сам прподукт
                product: true,
              },
            },
            // и ингредиенты
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(userCart);
  } catch (error) {
    console.log('[CART_GET] Server error', error);
    return NextResponse.json(
      { message: 'Не удалось получить корзину' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get('cartToken')?.value;

    if (!token) {
      token = crypto.randomUUID(); // генерируем уникальный токен
    }

    const userCart = await findOrCreateCart(token); // после получения информации о корзине возвращаем ее

    const data = (await req.json()) as CreateCartItemValues;

    const findCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productItemId: data.productItemId,
        ingredients: {
          every: {
            id: { in: data.ingredients }, // каждый ингредиент который есть у нас в карзине связать с findCartItem
          },
          // some: {}, // костыль проверки на наличие ингредиента
        },
      },
    });

    // Если товар был найден, делаем +1
    if (findCartItem) {
      await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + 1,
        },
      });
    } else {
      await prisma.cartItem.create({
        // если товар не найден создаем карзину
        data: {
          cartId: userCart.id, // берем id корзины
          productItemId: data.productItemId, // берем id продукта
          quantity: 1, // количество товара 1 по умолчанию на бэкэнде
          ingredients: { connect: data.ingredients?.map((id) => ({ id })) }, //массив объектов с определенными id ингредиентов
        },
      });
    }

    const updatedUserCart = await updateCartTotalAmount(token); // обновляем общую сумму корзины

    const resp = NextResponse.json(updatedUserCart); // это действие вернет ответ пользователю с новой обновленной карзиной и новым токеном если у него его не было
    resp.cookies.set('cartToken', token);
    return resp;
  } catch (error) {
    console.log('[CART_POST] Server error', error);
    return NextResponse.json(
      { message: 'Не удалось создать корзину' },
      { status: 500 }
    );
  }
}
