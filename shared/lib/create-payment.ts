import axios from 'axios';
import { PaymentData } from '@/@types/yookassa';

interface Props {
  description: string; // описание платежа
  orderId: number; // ID заказа для связи с платежом
  amount: number; // сумма платежа
}

export async function createPayment(details: any) {
  const { data } = await axios.post<PaymentData>(
    'https://api.yookassa.ru/v3/payments',
    {
      amount: {
        value: details.amount, // сумма платежа
        // если нужно то можно указать валюту платежа
        currency: 'RUB',
      },
      capture: true, // захват платежа сразу после создания
      description: details.description, // описание платежа
      metadata: {
        order_id: details.orderId, // ID заказа для связи с платежом
        // можно добавить другие метаданные, если нужно (например, ID пользователя) эти данные будут возвращаться в момент создания платежа и в момент подтверждения платежа в системе YooKassa и в системе вашего магазина
      },
      confirmation: {
        // эта отвечает куда нас переведет после успешного платежа
        type: 'redirect',
        return_url: process.env.YOOKASSA_CALLBACK_URL, // URL для перенаправления после успешного платежа
      },
    },
    {
      auth: {
        username: process.env.YOOKASSA_STORE_ID as string, // ID магазина, который вы получили при регистрации в YooKassa
        password: process.env.YOOKASSA_API_KEY as string, // ID магазина
      },
      headers: {
        'Content-Type': 'application/json', // тип контента
        'Idempotence-Key': Math.random().toString(36).substring(7), // уникальный ключ для предотвращения повторных платежей
      },
    }
  );

  return data;
}
