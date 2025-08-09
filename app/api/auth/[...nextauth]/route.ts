import { authOptions } from '@/shared/constants/auth-options';
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // тут говорится что это обработчик для GET и POST запросов
// это нужно для того чтобы next auth работал корректно и принимал запросы на авторизацию и аутентификацию
// в данном случае мы используем GitHub и Google провайдеры для авторизации пользователей
