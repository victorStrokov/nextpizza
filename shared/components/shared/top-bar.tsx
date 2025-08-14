import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Container } from './container';
import { Categories } from './categories';
import { SortPopup } from './sort-popup';
import { Category } from '@prisma/client';

interface Props {
  categories: Category[];
  className?: string;
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
  return (
    <div
      //движение сортировки и категорий при скролл вниз
      className={cn(
        'sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10',
        className
      )}>
      <Container className='flex flex-col sm:flex-row justify-between gap-4'>
        <div className='overflow-x-auto'>
          <Categories items={categories} />
        </div>
        {/* items={categories} только те категории в которых есть продукты  */}
        <div className='w-full sm:w-auto flex justify-end sm:justify-start'>
          <SortPopup />
        </div>
      </Container>
    </div>
  );
};
