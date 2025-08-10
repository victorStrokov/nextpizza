import * as products from './products'; // импортируем все продукты из products.ts все что там есть называем products
import * as ingredients from './ingredients'; // импортируем все ингредиенты из ./ingredients  все что там есть называем ingredients
import * as cart from './cart';
import * as auth from './auth';
// import * as stories from './stories';

export const Api = {
  products,
  ingredients,
  cart,
  auth,
  // stories,
};
