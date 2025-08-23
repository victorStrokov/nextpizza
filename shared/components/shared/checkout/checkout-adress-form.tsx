'use client';
import React from 'react';
import { Controller } from 'react-hook-form';

import { FormTextarea } from '../form';
import { WhiteBlock } from '../white-block';
import { ErrorText } from '../error-text';
import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';

const AdressInput = dynamic(() => import('../adress-input'), {
  ssr: false,
});

interface Props {
  className?: string;
}

export const CheckoutAdressForm: React.FC<Props> = ({ className }) => {
  const { control } = useFormContext();
  return (
    <WhiteBlock
      title='3. Адрес доставки'
      className={className}>
      <div className='flex flex-col gap-5'>
        {/* если в компонент нельзя прокинуть ref то можно использовать контроллер и в нем отрендерить компонент 
        передав имя поля за которым нужно следить свойство контроллер берем из контекста const { control } = useFormContext();
        field берем из рендера и говорим что как только трегерится onChange в него прокидываем field.onChange и вызываем onChange
         не просто инпута а onChange самой формы
         fieldState рендерит ошибку если она есть */}
        <Controller
          control={control}
          name='address'
          render={({ field, fieldState }) => (
            <>
              <AdressInput onChange={field.onChange} />
              {fieldState.error?.message && (
                <ErrorText text={fieldState.error.message} />
              )}
            </>
          )}
        />
        <FormTextarea
          name='comment'
          className='text-base'
          placeholder='Комментарий к заказу...'
          rows={5}
        />
      </div>
    </WhiteBlock>
  );
};
