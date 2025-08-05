import {
  Cart,
  CartItem,
  Ingredient,
  Product,
  ProductItem,
} from '@prisma/client';

// тип возврщает cartitem вместе с другим объектом
export type CartItemDTO = CartItem & {
  // в этом объекте есть связь с product
  productItem: ProductItem & {
    product: Product;
  };
  ingredients: Ingredient[];
};

export interface CartDTO extends Cart {
  items: CartItemDTO[];
}
// получаем его в servises / cart.ts
export interface CreateCartItemValues {
  productItemId: number;
  ingredients?: number[];
}
