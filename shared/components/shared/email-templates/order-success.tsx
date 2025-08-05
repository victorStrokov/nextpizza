import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import React from 'react';

interface Props {
  orderId: number;
  items: CartItemDTO[]; // Список товаров в заказе
  totalAmount: number;
}

export const OrderSuccessTemplate: React.FC<Props> = ({ orderId, items }) => (
  <div>
    <h1>Спасибо за покупку! </h1>

    <p>Ваш заказ #{orderId} оплачен. Список товаров в заказе:</p>

    <br />

    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.productItem.product.name} | {item.productItem.price} ₽ x
          {item.quantity} шт. = {item.productItem.price * item.quantity} ₽
        </li>
      ))}
    </ul>
  </div>
);
