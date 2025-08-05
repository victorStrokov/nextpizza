import { PizzaSize, PizzaType, mapPizzaType } from '../constants/pizza';
import { CartStateItem } from './get-cart-details';

export const getCartItemDetails = (
  ingredients: CartStateItem['ingredients'],
  pizzaType?: PizzaType,
  pizzaSize?: PizzaSize
): string => {
  // получаем детали пиццы  в виде текста :string
  const details = [];

  if (pizzaSize && pizzaType) {
    // если есть размер значит это пицца то добавляем его в details
    const typeName = mapPizzaType[pizzaType];
    details.push(`${typeName} ${pizzaSize} см`);
  }

  if (ingredients) {
    // если есть ингредиенты то добавляем в details
    details.push(...ingredients.map((ingredient) => ingredient.name));
  }

  return details.join(', ');
};
