import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // тут говорится что это обработчик для GET и POST запросов
// это нужно для того чтобы next auth работал корректно и принимал запросы на авторизацию и аутентификацию
// в данном случае мы используем GitHub и Google провайдеры для авторизации пользователей
