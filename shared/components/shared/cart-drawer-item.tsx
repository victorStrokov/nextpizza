import { cn } from '@/shared/lib/utils';
import React from 'react';

import * as CartItem from './cart-item-details';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import { CountButton } from './count-button';
import { Trash2Icon } from 'lucide-react';

interface Props extends CartItemProps {
  onClickCountButton?: (type: 'plus' | 'minus') => void; // вызов функции из родительского компонента для изменения количества товара в корзине
  onClickRemove?: () => void;
  className?: string;
}

export const CartDrawerItem: React.FC<Props> = ({
  imageUrl,
  name,
  price,
  quantity,
  details,
  disabled,
  onClickCountButton,
  onClickRemove,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row bg-white p-4 sm:p-5 gap-4 sm:gap-6 rounded-md',
        {
          'opacity-50 pointer-events-none': disabled, // pointer-events-none - убирает возможность кликать на элемент
        },
        className
      )}>
      <CartItem.Image
        src={imageUrl}
        className='w-20 h-20 object-cover rounded'
      />

      <div className='flex flex-col flex-1 min-w-0'>
        <CartItem.Info
          name={name}
          details={details}
          className='min-w-0 break-words'
        />

        <hr className='my-3' />

        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <CountButton
            onClick={onClickCountButton} // при клике вызывается функция из родительского компонента
            value={quantity}
          />

          <div className='flex items-center justify-between sm:justify-end gap-3'>
            <CartItem.Price value={price} />
            <Trash2Icon
              onClick={onClickRemove}
              className='text-gray-400 cursor-pointer hover:text-gray-600'
              size={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
