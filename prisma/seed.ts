import { Prisma } from '@prisma/client';
import { prisma } from './prisma-client';
import { hashSync } from 'bcryptjs';
import { categories, _ingredients, products } from './constants';

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
}; // рандомные числа для цены

const generateProductItem = ({
  productId,
  pizzaType,
  size,
}: {
  productId: number;
  pizzaType?: 1 | 2;
  size?: 20 | 30 | 40;
}) => {
  return {
    productId,
    price: randomNumber(190, 600),
    pizzaType,
    size,
  } as Prisma.ProductItemUncheckedCreateInput;
};
async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'User',
        email: 'user@test.ru',
        password: hashSync('1111', 10),
        verified: new Date(),
        role: 'USER',
      },
      {
        fullName: 'Admin',
        email: 'admin@test.ru',
        password: hashSync('1111', 10),
        verified: new Date(),
        role: 'ADMIN',
      },
    ],
  });

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.ingredient.createMany({
    data: _ingredients,
  });

  await prisma.product.createMany({
    data: products,
  });

  const pizza1 = await prisma.product.create({
    data: {
      name: 'Пепперони фреш',
      imageUrl:
        'https://media.dodostatic.net/image/r:233x233/11EE7D61304FAF5A98A6958F2BB2D260.webp',
      categoryId: 1,
      ingredients: {
        connect: _ingredients.slice(0, 5), // привязываем к продукту ингридиенты по индексу
      },
    },
  });
  const pizza2 = await prisma.product.create({
    data: {
      name: 'Сырная',
      imageUrl:
        'https://media.dodostatic.net/image/r:233x233/11EE7D610CF7E265B7C72BE5AE757CA7.webp',
      categoryId: 1,
      ingredients: {
        connect: _ingredients.slice(5, 10),
      },
    },
  });
  const pizza3 = await prisma.product.create({
    data: {
      name: 'Чоризо фреш',
      imageUrl:
        'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp',
      categoryId: 1,
      ingredients: {
        connect: _ingredients.slice(10, 40),
      },
    },
  });

  await prisma.productItem.createMany({
    data: [
      // Пицца "Пепперони фреш"
      generateProductItem({ productId: pizza1.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 40 }),

      // Пицца "Сырная"
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 30 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 40 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 20 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 40 }),

      // Пицца "Чоризо фреш"
      generateProductItem({ productId: pizza3.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 40 }),

      // Остальные продукты
      generateProductItem({ productId: 1 }),
      generateProductItem({ productId: 2 }),
      generateProductItem({ productId: 3 }),
      generateProductItem({ productId: 4 }),
      generateProductItem({ productId: 5 }),
      generateProductItem({ productId: 6 }),
      generateProductItem({ productId: 7 }),
      generateProductItem({ productId: 8 }),
      generateProductItem({ productId: 9 }),
      generateProductItem({ productId: 10 }),
      generateProductItem({ productId: 11 }),
      generateProductItem({ productId: 12 }),
      generateProductItem({ productId: 13 }),
      generateProductItem({ productId: 14 }),
      generateProductItem({ productId: 15 }),
      generateProductItem({ productId: 16 }),
      generateProductItem({ productId: 17 }),
    ],
  });

  await prisma.cart.createMany({
    // тестовые карзины пользователей
    data: [
      {
        userId: 1,
        totalAmount: 0,
        token: '11111',
      },
      {
        userId: 2,
        totalAmount: 0,
        token: '22222',
      },
    ],
  });

  // Превью историй (обложки)
  await prisma.story.createMany({
    data: [
      {
        previewImageUrl:
          'https://cdn.inappstory.ru/story/7n9/ule/pc0/bhm7iabtgrn6vts4ivs91tn/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAEAQ&v=4289463770',
      },
      {
        previewImageUrl:
          'https://cdn.inappstory.ru/story/u0f/5rs/dzw/wpo6ebzko4kbrn5ic81ztu0/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAEAQ&v=292540737',
      },
      {
        previewImageUrl:
          'https://cdn.inappstory.ru/story/wr6/bub/hou/xp0fpwep6h9hqvjld0xkbyl/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAEAQ&v=4162336677',
      },
      {
        previewImageUrl:
          'https://cdn.inappstory.ru/story/oqx/jih/gbl/mtm3ggisy2c9mnza5evipag/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAEAQ&v=367060751',
      },
      {
        previewImageUrl:
          'https://cdn.inappstory.ru/story/bwk/kr4/552/ccl6vq3rws5p3zirycbqzaz/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAEAQ&v=121430243',
      },
      {
        previewImageUrl:
          'https://cdn.inappstory.ru/story/sam/c6s/2lr/dxilnakqda6mdjfgii9llnb/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAEAQ&v=3003025662',
      },
      {
        previewImageUrl:
          'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQHZPf4VJ9unkrQ035S_sxnzpM4sXEW94Ss4Vi2jaOVvGtUUi9P',
      },
    ],
  });

  // Слайды для историй
  await prisma.storyItem.createMany({
    data: [
      // Story 1 — фото
      {
        storyId: 1,
        sourceUrl:
          'https://cdn.inappstory.ru/story/7n9/ule/pc0/bhm7iabtgrn6vts4ivs91tn/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAEAQ&v=4289463770',
      },

      // Story 2 — фото
      {
        storyId: 2,
        sourceUrl:
          'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQHB1WsClTuCzVHC0hXM2_mVlz1mtDMGCGWz2wuh927u2oKzd65',
      },
      {
        storyId: 2,
        sourceUrl:
          'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRHIvE_O09kklun5HoMJpZ2Yk2QvTlCKhcvTedMnibxKV8Hhm4m',
      },

      // Story 3 — видео
      {
        storyId: 3,
        sourceUrl:
          'https://i.pinimg.com/736x/62/75/93/627593770a9dd1dd08c1d7984010f328.jpg',
      },

      // Story 4 — фото
      {
        storyId: 4,
        sourceUrl:
          'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR2y5XU9Flpw6FW6uS76VZpQK1D1S7iXXBUiB6DJ--JnogOqRDk',
      },

      // Story 5 — видео
      {
        storyId: 5,
        sourceUrl:
          'https://cdn.inappstory.ru/story/bwk/kr4/552/ccl6vq3rws5p3zirycbqzaz/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAEAQ&v=121430243',
      },
      // Story 6 — фото
      {
        storyId: 6,
        sourceUrl:
          'https://cdn3.pepper.ru/topics/photos/612127/medium/image_picker_1AA04D5A-8D40-45A0-A88A-7CF1EAE6E661-10070-000005C9A136787E.jpg?1752937332',
      },
      {
        storyId: 6,
        sourceUrl:
          'https://cdn0.pepper.ru/attachments/photos/2390940/original/imagepicker701D6682-BF6D-4767-B980-B3762E8DEB35-10070-000005C9E355C9CA.jpg?1752917765',
      },
      {
        storyId: 7,
        sourceUrl:
          'https://sun9-30.userapi.com/impg/eXhQJAXN2Jj2wO05A6vB-P0Sf3dvnPgHuLtiDA/cj64O1Wx-Ps.jpg?size=604x604&quality=95&sign=61181f486838fad2c59b2351a15094cb&type=album',
      },
    ],
  });
} // генерировать данные

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Story" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "StoryItem" RESTART IDENTITY CASCADE`;
} // очищать данные

async function main() {
  try {
    await down(); //с начала очищаем
    await up(); // потом генерируем
  } catch (e) {
    console.log(e);
  }
}

main()
  .then(async () => {
    // ожидаем ответа
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
