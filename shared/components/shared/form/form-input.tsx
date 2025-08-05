'use client';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../ui/input';
import { ClearButton, ErrorText, RequiredSymbol } from '../index';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  // это extends React.InputHTMLAttributes<HTMLInputElement>  говорит о том что этот компонент принимает все атрибуты input html
  name: string;
  label?: string;
  required?: boolean; // обязательное поле или нет
  className?: string;
}

export const FormInput: React.FC<Props> = ({
  name,
  label,
  required,
  className,
  ...props
}) => {
  const {
    register, // регистрируем инпут в рамка reacthookform
    formState: { errors },
    watch,
    setValue,
  } = useFormContext(); // получаем контекст формы из react hook form через FormProvider что бы наш инпут работал через валидацию формы

  const value = watch(name); // получаем значение инпута отслеживает каждое изменение инпута в рамка reacthookform
  const errorText = errors[name]?.message as string; // получаем ошибку инпута;

  const onClickClear = () => {
    setValue(name, '', { shouldValidate: true }); // устанавливаем значение инпута в пустую строку { shouldValidate: true } выводит сообщение о необходимости заполнить поле
  };

  return (
    <div className={className}>
      {label && (
        <p className='font-medium mb-2'>
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className='relative'>
        <Input
          className='h-12 text-md'
          {...register(name)}
          {...props}
        />

        {value && <ClearButton onClick={onClickClear} />}
      </div>
      {errorText && (
        <ErrorText
          text={errorText}
          className='mt-2'
        />
      )}
    </div>
  );
};
