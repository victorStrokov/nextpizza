import { CartItemDTO } from '../services/dto/cart.dto';

export const calcCartItemTotalPrice = (item: CartItemDTO): number => {
  const ingredientsPrice = item.ingredients.reduce(
    (acc, ingredient) => acc + ingredient.price,
    0
  ); // проходим редьюс по всем ингредиентам аккамулируем их цены и складываем

  return (ingredientsPrice + item.productItem.price) * item.quantity; // к переменной ingredientsPrice прибавляем цену пиццы и умножаем на количество
};
