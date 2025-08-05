'use client';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
      {/* линия загрузки страницы */}
      <NextTopLoader />
    </>
  );
};

// желлательно все свои провайдеры оборачивать в один общий провайдер
// это нужно для того чтобы не было проблем с контекстом и чтобы все провайдеры работали корректно
// в данном случае мы используем SessionProvider для работы с авторизацией и Toaster для отображения уведомлений пользователю
// и NextTopLoader для отображения индикатора загрузки страницы
// в будущем можно будет добавить другие провайдеры, например для работы с локальным хранилищем или для работы с глобальным состоянием приложения
