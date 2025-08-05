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
          'p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden',
          className
        )}>
        <DialogDescription className='hidden'>
          Product Details
        </DialogDescription>
        <DialogTitle>Product Details</DialogTitle>
        <ProductForm
          product={product}
          onSubmit={() => router.back()}
        />
      </DialogContent>
    </Dialog>
  );
};
