'use client';

import { ProductWithRelations } from '@/@types/prisma';
import { useCartStore } from '@/shared/store';
import React from 'react';
import toast from 'react-hot-toast';
import { ChoosePizzaForm } from './choose-pizza-form';
import { ChooseProductForm } from './choose-product-form';
import { shallow } from 'zustand/shallow';

interface Props {
  product: ProductWithRelations;
  onSubmit?: VoidFunction;
  className?: string;
}

export const ProductForm: React.FC<Props> = ({
  product,
  onSubmit: _onSubmit,
}) => {
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);
  // добавление продукта в корзину
  const firstItem = product.items[0];
  const isPizzaForm = Boolean(firstItem.pizzaType); // проверяем продукт на вариации если true значит рендерим пиццы

  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      const itemId = productItemId ?? firstItem.id; // проверяем какой продукт в карзину добавлен пицца или продукт

      await addCartItem({ productItemId: itemId, ingredients }); // если productItemId есть значит мы добавляем  пиццу  если нет значит мы добавляем продукт

      toast.success(product.name + ' добавлен в корзину');

      _onSubmit?.(); // вызываем onCloseModal если действие выполнено
    } catch (error) {
      toast.error('Не удалось добавить товар в корзину');
      console.error(error);
    }
  };

  if (isPizzaForm) {
    return (
      <ChoosePizzaForm
        imageUrl={product.imageUrl}
        name={product.name}
        // onClickAdd={onCloseModal}
        ingredients={product.ingredients}
        items={product.items}
        onSubmit={onSubmit}
        loading={loading}
      />
    );
  }

  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      onSubmit={onSubmit}
      price={firstItem.price}
      loading={loading}
    />
  );
};
