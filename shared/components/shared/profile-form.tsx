'use client';

import React from 'react';
import {
  formRegisterSchema,
  TFormRegisterValues,
} from './modals/auth-modal/forms/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { User } from '.prisma/client/client';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import { Container } from './container';
import { Title } from './title';
import { FormInput } from './form';
import { Button } from '../ui';
import { updateUserInfo } from '@/app/actions';

interface Props {
  data: User;
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      password: '',
      confirmPassword: '',
    },
  });
  const onSubmint = async (data: TFormRegisterValues) => {
    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.success('Данные обновлены', {
        icon: '✅',
      });
    } catch (error) {
      return toast.error('Ошибка при обновлении данных', {
        icon: '❌',
      });
    }
  };

  const onClickSignOut = () => {
    signOut({
      callbackUrl: '/',
    });
  };

  return (
    // валидация формы смены пороля
    <Container className='my-10'>
      <Title
        text={`Личные данные | # ${data.fullName}`}
        size='md'
        className='font-bold'
      />
      <FormProvider {...form}>
        <form
          className='flex flex-col gap-5 w-96 mt-10'
          onSubmit={form.handleSubmit(onSubmint)}>
          <FormInput
            name='email'
            label='E-mail'
            required
          />
          <FormInput
            name='fullName'
            label='Полное имя'
            required
          />

          <FormInput
            type='password'
            name='password'
            label='Новый пароль'
            required
          />
          <FormInput
            type='password'
            name='confirmPassword'
            label='Повторите пароль'
            required
          />
          <Button
            disabled={form.formState.isSubmitting}
            className='text-base mt-10'
            type='submit'>
            Сохранить
          </Button>
          <Button
            onClick={onClickSignOut}
            variant='secondary'
            disabled={form.formState.isSubmitting}
            className='text-base'
            type='button'>
            Выйти
          </Button>
        </form>
      </FormProvider>
    </Container>
  );
};
