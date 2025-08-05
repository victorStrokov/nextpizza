// import { getCartDetails } from '../lib';
// import { create } from 'zustand';
// import { Api } from '../services/api-client';
// import { CartStateItem } from '../lib/get-cart-details';
// import { CreateCartItemValues } from '../services/dto/cart.dto';

// export interface CartState {
//   loading: boolean; // загрузка
//   error: boolean; // ошибка
//   totalAmount: number; // общая сумма
//   items: CartStateItem[]; // товары в корзине

//   fetchCartItems: () => Promise<void>; // функция получения всех товаров
//   updateItemQuantity: (id: number, quantity: number) => Promise<void>; // запрос обновление количества товара
//   // !!!!!!!!!!!!!! типизировать values
//   addCartItem: (values: any) => Promise<void>; // функция запрос на добавление товара в корзину
//   removeCartItem: (id: number) => Promise<void>; // функция запрос на удаления товара из корзины
// }

// export const useCartStore = create<CartState>((set, get) => ({
//   items: [],
//   error: false,
//   loading: true,
//   totalAmount: 0,

//   fetchCartItems: async () => {
//     try {
//       set({ loading: true, error: false }); // показ скелетона при вызове ингредиентов
//       const data = await Api.cart.getCart(); // получаем ингредиенты по запросу и возвращаем либо ответ либо ошибку, отлавливаем ошибку в ui преобразуем данные в нужный формат сохраним в состояние
//       set(getCartDetails(data)); //
//     } catch (error) {
//       console.error(error);
//       set({ error: true });
//     } finally {
//       set({ loading: false });
//     }
//   },
//   updateItemQuantity: async (id: number, quantity: number) => {
//     try {
//       set({ loading: true, error: false }); // показ скелетона при вызове ингредиентов
//       const data = await Api.cart.updateItemQuantity(id, quantity); //
//       set(getCartDetails(data)); //
//     } catch (error) {
//       console.error(error);
//       set({ error: true });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   removeCartItem: async (id: number) => {
//     try {
//       set({ loading: true, error: false }); // показ скелетона при вызове ингредиентов
//       const data = await Api.cart.removeCartItem(id); //
//       set(getCartDetails(data)); //
//     } catch (error) {
//       console.error(error);
//       set({ error: true });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   addCartItem: async (values: CreateCartItemValues) => {
//     // метод добавления товаров в карзину
//     try {
//       set({ loading: true, error: false }); // показ скелетона при вызове ингредиентов
//       const data = await Api.cart.addCartItem(values); //
//       set(getCartDetails(data)); //
//     } catch (error) {
//       console.error(error);
//       set({ error: true });
//     } finally {
//       set({ loading: false });
//     }
//   },
// }));

import { create } from 'zustand';
import { Api } from '../services/api-client';
import { getCartDetails } from '../lib';
import { CartStateItem } from '../lib/get-cart-details';
import { CreateCartItemValues } from '../services/dto/cart.dto';

export interface CartState {
  loading: boolean;
  error: boolean;
  totalAmount: number;
  items: CartStateItem[];

  /* Получение товаров из корзины */
  fetchCartItems: () => Promise<void>;

  /* Запрос на обновление количества товара */
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;

  /* Запрос на добавление товара в корзину */
  addCartItem: (values: CreateCartItemValues) => Promise<void>;

  /* Запрос на удаление товара из корзины */
  removeCartItem: (id: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  error: false,
  loading: true,
  totalAmount: 0,

  fetchCartItems: async () => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.getCart();
      set(getCartDetails(data));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  updateItemQuantity: async (id: number, quantity: number) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.updateItemQuantity(id, quantity);
      set(getCartDetails(data));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  removeCartItem: async (id: number) => {
    try {
      set((state) => ({
        loading: true,
        error: false,
        items: state.items.map((item) =>
          item.id === id ? { ...item, disabled: true } : item
        ),
      }));
      const data = await Api.cart.removeCartItem(id);
      set(getCartDetails(data));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set((state) => ({
        loading: false,
        items: state.items.map((item) => ({ ...item, disabled: false })),
      }));
    }
  },

  addCartItem: async (values: CreateCartItemValues) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.addCartItem(values);
      set(getCartDetails(data));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
}));
