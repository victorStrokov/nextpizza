import { PaymentCallBackData } from '@/@types/yookassa';
import { prisma } from '@/prisma/prisma-client';
import { OrderSuccessTemplate } from '@/server/email-templates/order-success';
import { sendEmail } from '@/server/send-email';

import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // ВЫТАСКИВАЕМ ДАННЫЕ ИЗ ЗАПРОСА
    const body = (await req.json()) as PaymentCallBackData;
    console.log('Webhook body:', body); // Логируем тело запроса для отладки
    // Ищем заказ и меняем его статус и кому принадлежит
    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.object.metadata.order_id), // эти данные вернет платежная систем YOOKASSA после успешной оплаты
      }, // так же вернется емейл и телефон пользователя так как ордер хранит эти данные
      // если нужно можно добавить include чтобы получить данные юзера и т.д.
      //   include: {
      //     user: true, // включаем юзера чтобы получить его данные это будет работать если пользователь зарегестрирован
      //   },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isSucceeded = body.object.status === 'succeeded'; // проверяем статус платежа

    // когда заказ найден проверяем статус платежа
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED, // меняем статус заказа на оплаченный или отмененный
      },
    });

    const items = JSON.parse(order?.items as string) as CartItemDTO[]; // парсим товары из заказа

    // Отправляем письмо с подтверждением заказа
    if (isSucceeded) {
      console.log(order.email);
      const { html, text } = OrderSuccessTemplate({
        orderId: order.id,
        items,
        totalAmount: order.totalAmount,
      });

      try {
        await sendEmail(
          order.email,
          'Next Pizza | Ваш заказ успешно оформлен',
          html,
          text
        );
      } catch (error) {
        console.error('Email send failed:', error);
      }
    } else {
      // Если платеж не прошел, можно отправить уведомление об этом
    }
  } catch (error) {
    console.error('[Checkout Callback] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
// TODO: Добавим сохранение логов вебхуков

//прикрутим отображение статуса заказа на фронте
