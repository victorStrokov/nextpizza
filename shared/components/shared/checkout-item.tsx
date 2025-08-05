'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import * as CartItemDetails from './cart-item-details';

interface Props extends CartItemProps {
  onClickCountButton?: (type: 'plus' | 'minus') => void; // вызов функции из родительского компонента для изменения количества товара в корзине
  onClickRemove?: () => void;

  className?: string;
}

export const CheckoutItem: React.FC<Props> = ({
  name,
  price,
  imageUrl,
  quantity,
  details,
  className,
  disabled,
  onClickCountButton,
  onClickRemove,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        {
          'opacity-50 pointer-events-none': disabled, // pointer-events-none - убирает возможность кликать на элемент
        },
        className
      )}>
      <div className='flex items-center gap-5 flex-1'>
        <CartItemDetails.Image src={imageUrl} />
        <CartItemDetails.Info
          className='flex-1'
          name={name}
          details={details}
        />
      </div>

      <CartItemDetails.Price value={price} />

      <div className='flex items-center gap-5 ml-20'>
        <CartItemDetails.CountButton
          onClick={onClickCountButton}
          value={quantity}
        />
        <button
          type='button'
          onClick={onClickRemove}>
          <X
            className='text-gray-400 cursor-pointer hover:text-gray-600'
            size={20}
          />
        </button>
      </div>
    </div>
  );
};
