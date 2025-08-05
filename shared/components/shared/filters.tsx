'use client';

import React from 'react';
import { Title } from './title';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useQueryFilters, useIngredients, useFilters } from '@/shared/hooks';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading } = useIngredients(); // хук ингредиентов
  const filters = useFilters(); // хук фильтрации

  useQueryFilters(filters);
  // рендерим ингредиенты
  const items = ingredients.map((item) => ({
    value: String(item.id),
    text: item.name,
  })); // переводим в нужный формат данных с бэка ингредиенты

  const updatePrices = (prices: number[]) => {
    console.log(prices, 'prices');
    filters.setPrices('priceFrom', prices[0]);
    filters.setPrices('priceTo', prices[1]);
  };

  return (
    <div className={className}>
      <Title
        text='Фильтрация'
        size='sm'
        className='mb-5 font-bold'
      />

      {/* Верхние чекбоксы */}
      <CheckboxFiltersGroup
        title='Тип теста'
        name='pizzaTypes'
        className='mb-5'
        onClickCheckbox={filters.setPizzaTypes}
        selected={filters.pizzaTypes}
        items={[
          { text: 'Тонкое', value: '1' },
          { text: 'Традиционное', value: '2' },
        ]}
      />

      <CheckboxFiltersGroup
        title='Размеры'
        name='sizes' // чтобы выбирались чекбоксы не по id а по названию и id
        className='mb-5'
        onClickCheckbox={filters.setSizes}
        selected={filters.sizes}
        items={[
          { text: '20 см', value: '20' },
          { text: '30 см', value: '30' },
          { text: '40 см', value: '40' },
        ]} // рендер всех ингридиентов
      />

      {/* Фильтр цен */}
      <div className='mt-5 border-y border-y-neutral-100 py-6 pb-7'>
        <p className='font-bold mb-3'>Цена от и до:</p>
        <div className='flex gap-3 mb-5'>
          <Input
            type='number'
            placeholder='0'
            min={100}
            max={1000}
            value={String(filters.prices.priceFrom)}
            onChange={(e) =>
              filters.setPrices('priceFrom', Number(e.target.value))
            }
          />
          <Input
            type='number'
            min={100}
            max={1000}
            placeholder='1000'
            value={String(filters.prices.priceTo)}
            onChange={(e) =>
              filters.setPrices('priceTo', Number(e.target.value))
            } // отлавливает изменение значений ползунков и инпута и обновляет стейт
          />
        </div>

        <RangeSlider
          min={100}
          max={1000}
          step={10}
          value={[
            filters.prices.priceFrom || 100,
            filters.prices.priceTo || 1000,
          ]}
          onValueChange={updatePrices} // onValueChange вернет массив из двух значений от и до и с помощью setPrice обновит стейт
        />
      </div>

      <CheckboxFiltersGroup
        title='Ингредиенты'
        name='ingredients' // чтобы выбирались чекбоксы не по id а по названию и id
        className='mt-5'
        limit={5} // показать по умолчанию 5 ингридиентов
        defaultItems={items.slice(0, 6)} // показать по умолчанию 5 ингридиентов
        items={items} // рендер всех ингридиентов
        loading={loading}
        onClickCheckbox={filters.setSelectedIngredients} // добавление ингридиента onAddId из useFilterIngredients он автоматически с помощью set вшивается в массив selectedIds
        selected={filters.selectedIngredients}
      />
    </div>
  );
};

//   // ** ИСПРАВИТЬ ЗАЦИКЛИВАНИЕ !!!!!!!!!!!!!!!
//   // useQueryFilters?.(filters);
//   //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
