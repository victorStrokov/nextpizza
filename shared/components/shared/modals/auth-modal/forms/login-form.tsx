import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { formLoginSchema, TFormLoginValues } from './schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInput, Title } from '@/shared/components';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

interface Props {
  className?: string;
  onSubmit?: (data: any) => void;
  onClose?: VoidFunction;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '', // типизирует поля формы <TFormLoginValues>
      password: '',
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (!resp?.ok) {
        toast.error('Ошибка при входе в аккаунт. Проверьте введенные данные.', {
          icon: '❌',
        });
      }
      onClose?.();
      toast.success('Вы успешно вошли в аккаунт!', { icon: '✅' });
    } catch (error) {
      console.error('Error [LOGIN] form:', error);
      toast.error('Ошибка при отправке формы. Неудалось войти в аккаунт.', {
        icon: '❌',
      });
    }
  };
  return (
    <FormProvider {...form}>
      <form
        className='flex flex-col gap-5'
        onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex justify-between items-center'>
          <div className='mr-2'>
            <Title
              text='Войти в аккаунт'
              size='md'
              className='font-bold'
            />
            <p className='text-gray-400'>
              Введите свою почту, чтобы войти в аккаунт
            </p>
            <img
              src='/assets/images/phone-icon.png'
              width={60}
              height={60}
              alt='phone-icon'
            />
          </div>
        </div>

        <FormInput
          name='email'
          label='Email'
          required
        />
        <FormInput
          name='password'
          label='Пароль'
          type='password'
          required
        />

        <Button
          loading={form.formState.isSubmitting}
          className='h-12 text-base'
          type='submit'>
          Войти
        </Button>
      </form>
    </FormProvider>
  );
};
