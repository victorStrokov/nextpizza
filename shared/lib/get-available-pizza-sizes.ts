/**
 * Функция для получения доступных размеров пиццы по type теста
 *
 * @example
 * ```
 * const availableSizes = getAvailablePizzaSizes(items, type);
 *````
 * @param items - массив вариантов пицц
 * @param type  - тип теста
 * @returns - массив доступных размеров
 */
import { ProductItem } from '@prisma/client';
import { PizzaType, pizzaSizes } from '../constants/pizza';
import { Variant } from '../components/shared/group-variants';

export const getAvailablePizzaSizes = (
  type: PizzaType,
  items: ProductItem[]
): Variant[] => {
  const filteredPizzasByType = items.filter((item) => item.pizzaType === type);
  //берем все выриации и фильтруем по type и берем только size
  return pizzaSizes.map((item) => ({
    name: item.name,
    value: item.value,
    disabled: !filteredPizzasByType.some(
      (pizza) => Number(pizza.size) === Number(item.value)
    ), // проверяем если один из размеров есть то true
  }));
};
