/**
 * Хук для управления состоянием размера и типа пиццы в модальном окне
 * @param availableSizes - массив доступных размеров пиццы
 * @returns - объект с состоянием размера и типа пиццы
 */
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';
import React from 'react';
import { Variant } from '../components/shared/group-variants';
import { useSet } from 'react-use';
import { getAvailablePizzaSizes } from '../lib';
import { ProductItem } from '@prisma/client';

interface ReturnProps {
  size: PizzaSize;
  type: PizzaType;
  selectedIngredients: Set<number>;
  availableSizes: Variant[];
  currentItemId?: number;
  setSize: (size: PizzaSize) => void;
  setType: (size: PizzaType) => void;
  addIngredient: (id: number) => void;
}

export const usePizzaOptions = (items: ProductItem[]): ReturnProps => {
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(
    new Set<number>([])
  );

  const availableSizes = getAvailablePizzaSizes(type, items);
  // получаем id текущего типа пиццы и размера и передаем его в модальное окно
  const currentItemId = items.find(
    (item) => item.pizzaType === type && item.size === size
  )?.id;

  React.useEffect(() => {
    // смотрим есть ли такая пицца в доступных размерах если есть то проверяем а не заблокирована ли она
    const isAvailableSize = availableSizes?.find(
      (item) => Number(item.value) === size && !item.disabled // если такой размер disabled то проверяем какой первый размер доступен и делаем его активным  (!isAvailableSize && availableSize)
    );
    const availableSize = availableSizes?.find((item) => !item.disabled); // берем первый найдленный доступный размер пиццы в таком тесте
    // если такой размер disabled то проверяем какой первый размер доступен и делаем его активным  (!isAvailableSize && availableSize)
    if (!isAvailableSize && availableSize) {
      // устанавливаем первый доступный размер в карточке пиццы модального окна
      setSize(Number(availableSize.value) as PizzaSize);
    }
  }, [type]);

  return {
    size,
    type,
    selectedIngredients,
    availableSizes,
    currentItemId,
    setSize,
    setType,
    addIngredient,
  };
};
