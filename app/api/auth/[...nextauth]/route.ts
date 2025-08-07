import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/prisma/prisma-client';
import { compare, hashSync } from 'bcrypt';
import { UserRole } from '@prisma/client';

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login, // имя пользователя из профиля гитхаб либо если имени нет его логин
          email: profile.email,
          image: profile.avatar_url,
          role: 'USER' as UserRole,
        };
      },
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
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'credentials') {
          return true;
        }

        if (!user.email) {
          return false; // если нет email, не пускаем пользователя
        }

        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              {
                provider: account?.provider,
                providerId: account?.providerAccountId,
              }, // ищем пользователя по провайдеру и email
              { email: user.email },
            ],
          },
        });

        if (findUser) {
          await prisma.user.update({
            where: { id: findUser.id },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
            },
          });
          return true; // если пользователь найден, возвращаем true
        }

        await prisma.user.create({
          data: {
            email: user.email,
            fullName: user.name || 'User #' + user.id,
            password: hashSync(user.id.toString(), 10), // так лучше не делать сюда передается id пользователя
            verified: new Date(),
            provider: account?.provider,
            providerId: account?.providerAccountId,
          },
        });

        return true;
      } catch (error) {
        console.error('Error [SIGN_IN]', error);
        return false;
      }
    },
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
