'use server';

import { prisma } from '@/prisma/prisma-client';
import { PayOrderTemplate } from '@/shared/components';

import { CheckoutFormValues } from '@/shared/constants';
import { createPayment, sendEmail } from '@/shared/lib';
import { OrderStatus } from '@prisma/client';
import { cookies } from 'next/headers';

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookiesStore = cookies(); // получаем куки сервера с помощью спуцифльной функци
    const cartToken = cookiesStore.get('cartToken')?.value;

    if (!cartToken) {
      throw new Error('Cart token not found');
    }
    // если токен есть то ищем корзину
    const userCart = await prisma.cart.findFirst({
      // берем все что нужно из корзины все связи с товарами и ингредиентами и юзером которому принадлежит корзина по токену
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        //поиск  ищем корзину по токену
        token: cartToken,
      },
    });

    // проверка если корзина не нашлась то возвращаем ошибку
    if (!userCart) {
      throw new Error('Cart not found');
    }
    // проверка если корзина пустая то возвращаем ошибку
    if (userCart?.totalAmount === 0) {
      throw new Error('Cart is empty');
    }
    // создаем заказ
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + ' ' + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: userCart.totalAmount, // берется из корзины и вшиваем в заказ  потому что после создания заказа корзина очищается
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
      },
    });
    // очищаем корзину обновляя ее но не удаляя
    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });
    // удаляем все ингредиенты из корзины
    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    const paymentData = await createPayment({
      amount: order.totalAmount, // сумма заказа
      orderId: order.id, // ID заказа для связи с платежом
      description: 'Оплата заказа No' + order.id, // описание платежа
    });

    if (!paymentData) {
      throw new Error('Payment data not found');
    }

    await prisma.order.update({
      where: {
        // обновляем заказ по ID
        // здесь мы ищем заказ по ID который был создан выше
        id: order.id,
      },
      data: {
        paymentId: paymentData.id, // сохраняем ID платежа в заказе для связи с платежом в случае возврата средств пользователю
      },
    });

    const paymentUrl = paymentData.confirmation.confirmation_url; // ссылка для оплаты заказа

    await sendEmail(
      data.email,
      'Next Pizza / Оплатите заказ No' + order.id,
      PayOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl, // ссылка для оплаты заказа
      })
    );

    return paymentUrl; // возвращаем ссылку для оплаты заказа
  } catch (error) {
    console.log('[CreateOrder] Server error', error);
  }
}
//  test  console.log(data);

//   const token = '123';
//   await prisma.order.create({
//     data: {
//       token,
//       totalAmount: 1500,
//       status: OrderStatus.PENDING,
//       items: [],
//       fullName: data.firstName + ' ' + data.lastName,
//       email: data.email,
//       phone: data.phone,
//       address: data.address,
//       comment: data.comment,
//     },
//   });

//   return 'https://www.mexc.com/ru-RU/assets/deposit/XNA';
