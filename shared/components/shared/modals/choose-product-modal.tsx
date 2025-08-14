'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductWithRelations } from '@/@types/prisma';
import { ProductForm } from '../index';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../../ui/dialog';
import { cn } from '@/shared/lib/utils';

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter(); // закрытие модального окна

  return (
    <Dialog
      open={Boolean(product)}
      onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          'w-full max-w-full sm:max-w-[90vw] md:max-w-[1060px]    max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-none sm:rounded-lg bg-white p-2 sm:p-4',
          className
        )}>
        <DialogDescription className='hidden'>{product.name}</DialogDescription>
        <DialogTitle>Вы выбрали {product.name}</DialogTitle>
        <ProductForm
          product={product}
          onSubmit={() => router.back()}
        />
      </DialogContent>
    </Dialog>
  );
};
