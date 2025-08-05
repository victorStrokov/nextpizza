'use client';

import { cn } from '@/shared/lib/utils';

import { useCategoryStore } from '@/shared/store/category';
import { Category } from '@prisma/client';
import React from 'react';

interface Props {
  items: Category[]; // список категорий
  className?: string;
}

export const Categories: React.FC<Props> = ({ items, className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId); // выбирает индекс активного элемента в видимости экрана

  return (
    <div
      className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {/*  с помощью items.map рендерим только те категории в которых есть продукты */}
      {items.map(({ name, id }, index) => (
        <a
          href={`/#${name}`} // активируем кнопки категорий и перемещение по странице с продуктами
          key={index}
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5',
            categoryActiveId === id &&
              'bg-white shadow-md shadow-gray-200 text-primary'
          )}>
          {name}
        </a>
      ))}
    </div>
  );
};
