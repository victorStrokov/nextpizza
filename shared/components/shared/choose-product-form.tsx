import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  loading?: boolean;
  onSubmit?: VoidFunction;
  className?: string;
}

/**
 * Форма выбора ПРОДУКТА
 */
export const ChooseProductForm: React.FC<Props> = ({
  name,
  imageUrl,
  price,
  onSubmit,
  className,
  loading,
}) => {
  return (
    <div
      className={cn(
        className,
        'flex flex-col lg:flex-row items-center gap-6 w-full'
      )}>
      {/* верстка картнки продукта */}
      <div className='w-full lg:w-[350px] flex justify-center'>
        <img
          src={imageUrl}
          alt={name}
          className='w-full max-w-[300px] h-auto object-cover rounded-md'
        />
      </div>

      <div className='w-full lg:w-[490px] bg-[#f7f6f5] p-6 rounded-md'>
        <Title
          text={name}
          size='md'
          className='font-extrabold mb-3 text-center lg:text-left'
        />

        <Button
          loading={loading}
          onClick={() => onSubmit?.()}
          className='h-[50px] px-6 text-base rounded-xl w-full mt-6'>
          Добавить в корзину за {price} ₽
        </Button>
      </div>
    </div>
  );
};
