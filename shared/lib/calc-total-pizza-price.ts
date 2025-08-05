import { Ingredient, ProductItem } from '@prisma/client';
import { PizzaSize, PizzaType } from '../constants/pizza';

/**
 * Функция для подсчета общей стоимости пиццы
 *
 * @param type - тип теста выбранной пиццы
 * @param size - размер выбранной пиццы
 * @param items - список вариаций
 * @param ingredients - список ингредиентов
 * @param selectedIngredients - выбранные ингредиенты
 *
 * @returns number общую стоимость
 */
export const calcTotalPizzaPrice = (
  type: PizzaType,
  size: PizzaSize,
  items: ProductItem[],
  ingredients: Ingredient[],
  selectedIngredients: Set<number>
) => {
  //  поиск выриаций пиццы по size и type  в массиве items и отображение цены
  const pizzaPrice = // todo нужно сделать так что бы при выборе не существкющей пиццы сбрасывалось на первый вариант
    items.find((item) => item.pizzaType === type && item.size === size)
      ?.price || 0; // так как уверен что вариация найдется следует обратиться к нему и вырать его цену ставим !

  const totalIngredientsPrice = ingredients
    .filter((ingredient) => selectedIngredients.has(ingredient.id))
    .reduce((acc, ingredient) => acc + ingredient.price, 0); // берем все ингредиенты фильтруем то что не выбрано и прибавляем стоимость к аккумулятору асс

  return pizzaPrice + totalIngredientsPrice; // считаем общую стоимость
};
