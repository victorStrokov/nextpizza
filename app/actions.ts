'use server';

import { prisma } from '@/prisma/prisma-client';
import { PayOrderTemplate } from '@/server/email-templates/pay-order';
import { VerificationUserTemplate } from '@/server/email-templates/verification-user';
import { CheckoutFormValues } from '@/shared/constants';
import { createPayment } from '@/shared/lib';
import { getUserSession } from '@/shared/lib/get-user-sesion';
import { sendEmail } from '@/server/send-email';
import { OrderStatus, Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { cookies } from 'next/headers';

// создание нового заказа
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
    const { html, text } = PayOrderTemplate({
      orderId: order.id,
      totalAmount: order.totalAmount,
      paymentUrl, // ссылка для оплаты заказа
    });
    try {
      await sendEmail(
        // 'strokof2@gmail.com', // Временный email для тестов
        data.email,
        'Next Pizza / Оплатите заказ No' + order.id,
        html,
        text
      );
    } catch (error) {
      console.error('Failed to send email in createOrder:', error);
    }

    return paymentUrl; // возвращаем ссылку для оплаты заказа
  } catch (error) {
    console.log('[CreateOrder] Server error', error);
  }
}

// обновление информации о пользователе
export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession(); // получаем текущего пользователя из сессии
    if (!currentUser) {
      // проверка на наличие текущего пользователя
      throw new Error('Пользователь не найден!');
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        // берем тот id который был получен из сессии
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password
          ? hashSync(body.password as string, 10)
          : findUser?.password, // если пароль не указан, то оставляем старый
      },
    });
  } catch (error) {
    console.log('Error [UPDATE_USER]', error);
    throw error;
  }
}

// регистрация нового пользователя
export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (user.verified) {
        throw new Error('Почта не подтверждена');
      }

      throw new Error('Пользователь с таким email не существует');
    }
    //  если пользователь не найден, то создаем нового
    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // генерируем 6-значный код

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id, // кому передаем код , толькочто созданному пользователю
      },
    });

    try {
      await sendEmail(
        createdUser.email,
        'Next Pizza / Подтверждение регистрации',
        VerificationUserTemplate({ code })
      );
    } catch (error) {
      console.error('Failed to send email in registerUser:', error);
    }
  } catch (error) {
    console.log('Error [REGISTER_USER]', error);
    throw error;
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
