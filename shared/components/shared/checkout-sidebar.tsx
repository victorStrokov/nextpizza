import React from 'react';
import { WhiteBlock } from './white-block';
import { CheckoutItemDetails } from './checkout-item-details';
import { ArrowRight, Package, Percent, Truck } from 'lucide-react';
import { Button, Skeleton } from '../ui';
import { useCart } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';

const VAT = 15; // 15% НДС
const DELIVERY_PRICE = 250; // 250 рублей доставка
interface Props {
  totalAmount: number;
  loading?: boolean;
  className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({
  totalAmount,
  loading,

  className,
}) => {
  const vatPrice = (totalAmount * VAT) / 100; // 15% НДС = 15% от общей стоимости
  const totalPrice = totalAmount + DELIVERY_PRICE + vatPrice; // общая стоимость + доставка + НДС

  return (
    <WhiteBlock className={cn('p-6 sticky  top-4', className)}>
      <div className='flex flex-col gap-1'>
        <span className='text-xl'>Итого</span>
        {loading ? (
          <Skeleton className='w-48 h-11' />
        ) : (
          <span className='h-11 text-[34px] font-extrabold'>
            {totalPrice} ₽
          </span>
        )}
      </div>

      <CheckoutItemDetails
        title={
          <div className='flex items-center'>
            <Package
              size={20}
              className='mr-2 text-gray-400'
            />
            Стоимость корзины:
          </div>
        }
        value={
          loading ? (
            <Skeleton className='h-6 w-14 rounded-[6px]' />
          ) : (
            `${totalAmount} ₽`
          )
        } // общая стоимость
      />
      <CheckoutItemDetails
        title={
          <div className='flex items-center'>
            <Percent
              size={20}
              className='mr-2 text-gray-400'
            />
            Налоги:
          </div>
        }
        value={
          loading ? (
            <Skeleton className='h-6 w-14 rounded-[6px]' />
          ) : (
            `${vatPrice} ₽`
          )
        } // 15% НДС
      />
      <CheckoutItemDetails
        title={
          <div className='flex items-center'>
            <Truck
              size={20}
              className='mr-2 text-gray-400'
            />
            Доставка:
          </div>
        }
        value={
          loading ? (
            <Skeleton className='h-6 w-14 rounded-[6px]' />
          ) : (
            `${DELIVERY_PRICE} ₽`
          )
        } // 250 рублей доставка
      />

      <Button
        loading={loading}
        type='submit'
        disabled={false}
        className='w-full h-14 rounded-2xl mt-6 text-base font-bold'>
        Перейти к оплате <ArrowRight className='w-5 ml-2' />
      </Button>
    </WhiteBlock>
  );
};
