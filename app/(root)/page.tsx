import {
  Container,
  Filters,
  Title,
  TopBar,
  ProductsGroupList,
  Stories,
} from '@/shared/components/shared';
import { Suspense } from 'react';
import { GetSearchParams, findPizzas } from '@/shared/lib/find-pizzas';

export default async function Home({
  searchParams,
}: {
  searchParams: GetSearchParams;
}) {
  const categories = await findPizzas(searchParams);

  return (
    <>
      <Container className='mt-10 px-4'>
        <Title
          text='Все продукты'
          size='lg'
          className='font-extrabold'
        />
      </Container>
      {/*  categories={categories.filter(
           (category) => category.products.length > 0
        )} конструкция проверяет есть ли продукты в категориях и рендерит только не пустые*/}

      <TopBar
        categories={categories.filter(
          (category) => category.products.length > 0
        )}
      />

      <Stories />

      <Container className='mt-10 pb-14'>
        <div className='flex flex-col lg:flex-row gap-6 min-w-0'>
          {/* Фильтрация */}
          <div className='lg:w-[250px] w-full shrink-0'>
            <Suspense>
              <Filters />
            </Suspense>
          </div>

          {/* Список товаров */}
          <div className='flex-1  min-w-0'>
            <div className='flex flex-col gap-16'>
              {categories.map(
                (category) =>
                  category.products.length > 0 && (
                    <ProductsGroupList // рендер списка продуктов с бэкэнда
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      items={category.products}
                    />
                  )
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
