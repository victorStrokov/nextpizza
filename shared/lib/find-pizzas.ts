import { prisma } from '@/prisma/prisma-client';

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  sizes?: string;
  pizzaTypes?: string;
  ingredients?: string;
  priceFrom?: string;
  priceTo?: string;
  //   limit?: string; для пагинации если нужно
  //   page?: string; для пагинации если нужно
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

export const findPizzas = async (params: GetSearchParams) => {
  const sizes = params.sizes?.split(',').map(Number); // тут говорится возьми парамс из него вытащи sizes, преврати в массив строк  и преврати в числа
  const pizzaTypes = params.pizzaTypes?.split(',').map(Number); // тут говорится возьми парамс из него вытащи pizzaTypes, преврати в массив строк  и преврати в числа
  const ingredientsIdArr = params.ingredients?.split(',').map(Number); // тут говорится возьми парамс из него вытащи ingredients, преврати в массив строк

  const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
  const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

  const categories = await prisma.category.findMany({
    // берем все категории но в месте с ними и продукты
    include: {
      // include говорит о том что когда мы берем все категории так же прикручиваем все связи которые они включают
      products: {
        orderBy: {
          id: 'desc',
        },
        where: {
          ingredients: ingredientsIdArr
            ? {
                some: {
                  id: {
                    // поиск по параметру id
                    in: ingredientsIdArr, // найди тот id  который есть в этом массиве
                  },
                },
              }
            : undefined,
          items: {
            some: {
              size: {
                // поиск по параметру size
                in: sizes,
              },
              pizzaType: {
                // поиск по параметру pizzaType
                in: pizzaTypes,
              },
              price: {
                // поиск по параметру price
                gte: minPrice, // где больше или равно
                lte: maxPrice, // где меньше или равно
              },
            },
          },
        },
        include: {
          // создай объект проверь проверь что в одном из этих (ингредиентов)должно бьть то что  есть в этом массиве
          ingredients: true,
          items: {
            where: {
              price: {
                gte: minPrice,
                lte: maxPrice,
              },
            },
            orderBy: {
              // ищем в бьазе цены товаров по возрастанию от меньшего и добавляем на страницу
              price: 'asc',
            },
          },
        },
      },
    },
  });

  return categories;
};
