/**
 * Функция получения ингредиентов и товаро в корзине
 * @returns // получаем ингредиенты по запросу и возвращаем либо ответ либо ошибку
 */

import { axiosInstance } from './instance';
import { CartDTO, CreateCartItemValues } from './dto/cart.dto';

export const getCart = async (): Promise<CartDTO> => {
  return (await axiosInstance.get<CartDTO>('/cart')).data;
};

export const updateItemQuantity = async (
  itemId: number,
  quantity: number
): Promise<CartDTO> => {
  return (await axiosInstance.patch<CartDTO>('/cart/' + itemId, { quantity }))
    .data;
};

export const removeCartItem = async (id: number): Promise<CartDTO> => {
  return (await axiosInstance.delete<CartDTO>('/cart/' + id)).data; // фу-я получит id отправит на сервер delete  и удалит товар из корзины по id
};

export const addCartItem = async (
  values: CreateCartItemValues
): Promise<CartDTO> => {
  return (await axiosInstance.post<CartDTO>('/cart', values)).data;
};
