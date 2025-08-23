'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { SearchInput } from './search-input';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { CartButton } from './cart-button';
import { ProfileButton } from './profile-button';
import { AuthModal } from './modals';

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({
  hasSearch = true,
  hasCart = true,
  className,
}) => {
  const router = useRouter();
  const [openAuthModal, setOpenAuthModal] = React.useState(false);

  // используем useSession из next-auth для получения информации о пользователе
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!searchParams || !router) return;
    let toastMessage = '';

    if (searchParams.has('paid')) {
      toastMessage = 'Заказ успешно оплачен! Информация отправлена на почту.';
    }

    if (searchParams.has('verified')) {
      toastMessage = 'Почта успешно подтверждена!';
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace('/');
        toast.success(toastMessage, {
          duration: 3000,
        });
      }, 1000);
    }
  }, [searchParams, router]);

  return (
    <header className={cn('border-b', className)}>
      <Container className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4 px-4'>
        {/* Левая часть */}
        <Link href='/'>
          <div className='flex items-center gap-4'>
            <Image
              src='/logo.png'
              alt='Logo'
              width={30}
              height={30}
            />
            <div>
              <h1 className='text-xl sm:text-2xl uppercase font-black'>
                Next Pizza
              </h1>
              <p className='text-xs sm:text-sm text-gray-400 leading-3'>
                вкусней уже некуда
              </p>
            </div>
          </div>
        </Link>

        {hasSearch && ( // если страница checkout то убираем поиск
          <div className='w-full sm:w-auto'>
            <SearchInput />
          </div>
        )}

        {/* Правая часть */}
        <div className='flex gap-2 items-center justify-end'>
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
