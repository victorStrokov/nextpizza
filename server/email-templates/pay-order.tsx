interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
}

export function PayOrderTemplate({ orderId, totalAmount, paymentUrl }: Props): {
  html: string;
  text: string;
} {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: f9f9f9;padding: 24px; border-radius: 8px; color: #333;">
    <h2 style="color: #d62828;"> Ваш заказ № ${orderId}</h2>
     <p style="font-size: 16px;">
        Благодарим за оформление заказа в <strong>Next Pizza</strong>!
      </p>
       <p style="font-size: 16px;">
        Пожалуйста, оплатите заказ на сумму <strong>${totalAmount} ₽</strong>.
      </p>
      <div style="margin: 20px 0;">
        <a href="${paymentUrl}" style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #d62828;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        ">
          Оплатить заказ
        </a>
      </div>
         <p style="font-size: 14px; color: #777;">
        Если у вас возникли вопросы, свяжитесь с нами по почте или через Telegram.
      </p>
    </div>
  `;

  const text = `Заказ №${orderId}
Сумма к оплате: ${totalAmount} ₽
Оплатите заказ по ссылке:
${paymentUrl}
Спасибо за покупку!
Если возникли вопросы — напишите нам на почту или в Telegram.
  `.trim();
  return { html, text };
}
