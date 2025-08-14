'use client';

import { cn } from '@/shared/lib/utils';
import { Api } from '@/shared/services/api-client';
import { Product } from '@prisma/client';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useClickAway, useDebounce } from 'react-use';

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState(''); // отвечает за значения из инпута
  const [focused, setFocused] = React.useState(false); // отвечает за фокус инпута
  const [products, setProducts] = React.useState<Product[]>([]); // отвечает за продукты
  const ref = React.useRef(null); // отлавливаем клик на инпут
  // отлавливаем клик на инпут и затемняем экран
  useClickAway(ref, () => {
    setFocused(false);
  });
  // тут говорим useDebounce выполни эту фун-ию через каждые 250 мс проверяй
  // предыдущие изменения если через 250 мс еще чтото ввели отправляй запрос ещен один запрос
  // если нет отправляй то что введено
  useDebounce(
    async () => {
      try {
        const response = await Api.products.search(searchQuery);
        setProducts(response);
      } catch (error) {
        console.log(error);
      }
    },
    250,
    [searchQuery]
  );
  // при выборе товара в инпуте очищает поиск, закрывает попап, убирает фокус
  const onClickItem = () => {
    setFocused(false);
    setSearchQuery('');
    setProducts([]);
  };

  return (
    <>
      {focused && (
        <div className='fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30' />
      )}

      <div
        ref={ref} // отлавливаем клик на инпут
        className={cn(
          'flex items-center justify-between relative z-30',
          'h-10 sm:h-11 md:h-12',
          'w-full sm:w-64 md:w-80 lg:w-96',
          'rounded-2xl bg-gray-100 px-3',
          className
        )}>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
        <input
          className='w-full pl-10 pr-3 bg-transparent outline-none text-sm sm:text-base'
          type='text'
          placeholder='Найти пиццу...'
          onFocus={() => setFocused(true)} // отлавливаем клик на инпут
          value={searchQuery} // отвечает за значения из инпута
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {products.length > 0 && (
          <div
            className={cn(
              'absolute left-0 w-full bg-white rounded-xl py-2 shadow-md transition-all duration-200 invisible opacity-0 z-30',
              'max-h-80 overflow-y-auto',
              // затемнение экрана при фокусе на инпут
              focused && 'visible opacity-100 top-[calc(100%+8px)]' // АНИМАЦИЯ ПОПАП ПОИСКА СНИЗУ
            )}>
            {products.map((product) => (
              // рендер продуктов из поиска инпута
              <Link
                onClick={onClickItem} // при выборе товара в инпуте очищает поиск, закрывает попап, убирает фокус
                key={product.id}
                className='flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10'
                href={`/product/${product.id}`}>
                <img
                  className='rounded-sm h-8 w-8'
                  src={product.imageUrl}
                  alt={product.name}
                />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
