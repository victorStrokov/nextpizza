'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CheckoutSidebar,
  Container,
  Title,
  CheckoutAdressForm,
  CheckoutCart,
  CheckoutPersonalForm,
} from '@/shared/components';
import { CheckoutFormSchema, CheckoutFormValues } from '@/shared/constants';
import { useCart } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import { createOrder } from '@/app/actions';
import toast from 'react-hot-toast';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Api } from '@/shared/services/api-client';

export default function CheckoutPage() {
  const [submitting, setSubmitting] = React.useState(false);
  const { data: session } = useSession();
  const { totalAmount, items, updateItemQuantity, removeCartItem, loading } =
    useCart();
  const onClickCountButton = (
    id: number,
    quantity: number,
    type: 'plus' | 'minus'
  ) => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;

    updateItemQuantity(id, newQuantity);
  };

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema), // специальная функция для валидации
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      comment: '',
    },
  });

  // отслеживаем изменения сессии и вшиваем данные авторизованного пользователя в поля оформления заказа
  React.useEffect(() => {
    // ф-ия обновляет форму и
    async function fetchUserInfo() {
      const data = await Api.auth.getMe();
      const [firstName, lastName] = data.fullName.split(' '); // разбивает fullName на имя и фамилию  с пробелом
      form.setValue('firstName', firstName);
      form.setValue('lastName', lastName);
      form.setValue('email', data.email);
    }
    if (session) {
      fetchUserInfo();
    }
  }, [form, session]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);
      const url = await createOrder(data);
      toast.error('Заказ успешно оформлен! 📝 Переход на страницу оплату... ', {
        icon: '✅',
      });

      if (url) {
        location.href = url;
      }
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      toast.error('Не удалось создать заказ', { icon: '❌' });
    }
  };

  return (
    <Container className='mt-10'>
      <Title
        text='Оформление заказа'
        className='font-extrabold mb-8 text-[36px]'
      />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* этот div делает отступ справа что бы поместился блок */}
          <div className='flex gap-10'>
            {/* Левый блок */}
            <div className='flex flex-col gap-10 flex-1 mb-20'>
              <CheckoutCart
                onClickCountButton={onClickCountButton}
                removeCartItem={removeCartItem}
                items={items}
                loading={loading}
              />
              <CheckoutPersonalForm
                className={cn({ 'opacity-40 pointer-events-none': loading })}
                // {'opacity-40 pointer-events-none' : loading} этот объеки делает прозрачной форму если loading = true
              />
              <CheckoutAdressForm
                className={cn({ 'opacity-40 pointer-events-none': loading })}
              />
            </div>

            {/* Правый блок */}
            <div className='w-[459px]'>
              <CheckoutSidebar
                totalAmount={totalAmount}
                loading={loading || submitting}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
