import { z } from 'zod';

export const CheckoutFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Имя должно содержать не менее 2-х символов' }), // zood дает валидацию строчки минимальная длинна имени 2 символа если не указано optional() поле будет обязательным для заполнения
  lastName: z
    .string()
    .min(2, { message: 'Фамилия должна содержать не менее 2-х символов' }),
  email: z.string().email({ message: 'Введите корректную почту' }),
  phone: z.string().min(9, { message: 'Введите корректный номер телефона' }),
  address: z.string().min(4, { message: 'Введите корректный адрес' }),
  comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;
