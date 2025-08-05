import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(4, { message: 'Введите корректный пароль' });

//  zod создает схему валидации для формы входа в виде объекта
export const formLoginSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: passwordSchema,
});
export const formRegisterSchema = formLoginSchema
  .merge(
    z.object({
      fullName: z.string().min(2, { message: 'Введите ваше имя и фамилию' }),
      confirmPassword: passwordSchema,
    })
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'], // указывает на поле, где ошибка должна отображаться
  });

export type TFormLoginValues = z.infer<typeof formLoginSchema>; // тип для значений формы входа берем от самой схемы валидации
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>; // тип для значений формы регистрации берем от самой схемы регистрации
