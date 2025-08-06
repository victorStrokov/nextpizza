import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/prisma/prisma-client';
import { compare } from 'bcrypt';

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const value = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findFirst({
          where: value,
        });

        if (!findUser) {
          return null;
        }

        const isPasswordValid = await compare(
          // сравниваем пароли
          credentials.password,
          findUser.password
        );

        if (!isPasswordValid) {
          return null;
        }

        if (!findUser.verified) {
          return null; // если пользователь не верифицирован, возвращаем null
        }

        return {
          id: String(findUser.id),
          email: findUser.email,
          fullName: findUser.fullName,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callback: {
    async jwt({ token }) {
      const findUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (findUser) {
        token.id = String(findUser.id);
        token.email = findUser.email;
        token.fullName = findUser.fullName;
        token.role = findUser.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // тут говорится что это обработчик для GET и POST запросов
// это нужно для того чтобы next auth работал корректно и принимал запросы на авторизацию и аутентификацию
// в данном случае мы используем GitHub и Google провайдеры для авторизации пользователей
