import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
  className?: string;
  imageUrl: string;
  size: 20 | 30 | 40;
}

export const PizzaImage: React.FC<Props> = ({ imageUrl, size, className }) => {
  return (
    <div
      className={cn(
        // класс центрует изображение и пунктира
        'flex items-center justify-center flex-1 relative w-full',
        className
      )}>
      <img
        src={imageUrl}
        alt='Logo'
        className={cn(
          'relative left-2 top-2 transition-all z-10 duration-300 rounded-full object-cover',
          {
            'w-[180px] h-[180px] sm:w-[300px] sm:h-[300px]': size === 20,
            'w-[240px] h-[240px] sm:w-[400px] sm:h-[400px]': size === 30,
            'w-[280px] h-[280px] sm:w-[500px] sm:h-[500px]': size === 40,
          }
        )}
      />
      {/* черточки вокруг картинки  */}
      <div
        className='hidden sm:block
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          border-dashed border-2 rounded-full border-gray-200
          w-[450px] h-[450px]'
      />
      <div
        className='hidden sm:block
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          border-dotted border-2 rounded-full border-gray-100
          w-[370px] h-[370px]'
      />
    </div>
  );
};
