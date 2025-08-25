import { CartItemDTO } from '@/shared/services/dto/cart.dto';

interface Props {
  orderId: number;
  items: CartItemDTO[];
  totalAmount: number;
}

export function OrderSuccessTemplate({ orderId, items, totalAmount }: Props): {
  html: string;
  text: string;
} {
  const itemsHtml = items
    .map(
      (item) => `
      <li>
          <strong>${item.productItem.product.name}</strong> — 
          ${item.productItem.price} ₽ × ${item.quantity} шт. = 
          <b>${item.productItem.price * item.quantity} ₽</b>
        </li>

    `
    )
    .join('');

  const itemsText = items
    .map(
      (item) =>
        `${item.productItem.product.name} — ${item.productItem.price} ₽ × ${item.quantity} шт. = ${item.productItem.price * item.quantity} ₽`
    )
    .join('\n');

  const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #d62828;">Спасибо за покупку!</h1>
      <p>Ваш заказ №${orderId} успешно оплачен. Список товаров:</p>
      <ul style="padding-left: 20px;">
        ${itemsHtml}
      </ul>
      <p><strong>Итого:</strong> ${totalAmount} ₽</p>
      <hr />
      <p style="font-size: 12px; color: #888;">
        Если у вас есть вопросы, напишите нам на почту или в Telegram.
      </p>
    </div>
`;
  const text = `
Спасибо за покупку!
Ваш заказ №${orderId} успешно оплачен.

Список товаров:
${itemsText}

Итого: ${totalAmount} ₽

Если у вас есть вопросы, напишите нам на почту или в Telegram.
  `.trim();

  return { html, text };
}
