'use client'; // если внутри компанента есть js или любая другая функция с которой должен взаимодействовать браузер а не сервер используем use client но по возможности избегать этого

import React from 'react';
import { FilterChecboxProps, FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui/input';
import { Skeleton } from '../ui';

type Item = FilterChecboxProps;

interface Props {
  title: string; // заголовок группы чекбоксов
  items: Item[]; // сами чек боксы, общее количество их
  defaultItems?: Item[]; //  default чек боксы те которые видны пользователю при не раскрытом списке чекбоксов
  limit?: number; // сколько чек боксов показать по умолчанию
  loading?: boolean; // загрузка чек боксов
  searchInputPlaceholder?: string; // строка поиска чекбокса
  onClickCheckbox?: (id: string) => void; // событие при клике на чек бокс возвращает какие чек боксы выбраны
  defaultValue?: string[]; // default выбранные чек боксы
  selected?: Set<string>;
  className?: string;
  name?: string; // чтобы выбирались чекбоксы не по id а по названию и id
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  defaultItems,
  limit = 5,
  searchInputPlaceholder = 'Поиск...',
  className,
  loading,
  onClickCheckbox,
  selected,
  name,
}) => {
  const [showAll, setShowAll] = React.useState(false); // открытие закрытие чек боксов
  const [searchValue, setSearchValue] = React.useState('');

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value); // событие при вводе в инпут возвращает введенные данные поиск чекбоксов
  };

  if (loading) {
    return (
      <div className={className}>
        <p className='font-bold mb-3'>{title}</p>

        {...Array(limit) // пустой массив с нашим лимитом по умолчанию
          .fill(0) // заполняем нулями
          .map((_, index) => (
            <Skeleton
              key={index}
              className='h-6 mb-4 rounded-[8px]'
            />
          ))}

        <Skeleton className='w-28 h-6 mb-4 rounded-[8px]' />
      </div>
    );
  }
  //фильтруем даанные из инпута и отображем если есть совпадения в тексте чек бокса
  const list = showAll
    ? items.filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLocaleLowerCase())
      )
    : (defaultItems || items).slice(0, limit); // если showAll true то показать все чек боксы иначе показать по умолчанию

  return (
    <div className={className}>
      <p className='font-bold mb-3'>{title}</p>
      {/*  showAll если кнопка показать все нажата показать поиск */}
      {showAll && (
        <div className='mb-5'>
          <Input
            onChange={onChangeSearchInput} // событие при вводе в инпут возвращает введенные данные поиск чекбоксов
            placeholder={searchInputPlaceholder}
            className='bg-gray-50 border-none'
          />
        </div>
      )}

      <div className='flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar '>
        {list.map((item, index) => (
          <FilterCheckbox
            key={index}
            text={item.text} // текст чекбокса
            value={item.value} // значение чек бокса
            endAdornment={item.endAdornment}
            checked={selected?.has(item.value)} // проверка чек бокса на выбор если есть удаляет если нет добавляет
            onCheckedChange={() => onClickCheckbox?.(item.value)} // при клике на чек бокс возвращает какие чек боксы выбраны (id чек бокса)
            name={name} // чтобы выбирались чекбоксы не по id а по названию и id
          />
        ))}
      </div>

      {items.length > limit && (
        // если количество чек боксов больше чем limit показать кнопку
        <div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
          <button
            onClick={() => setShowAll(!showAll)}
            className='text-primary mt-3'>
            {showAll ? 'Скрыть' : '+ Показать все'}
          </button>
        </div>
      )}
    </div>
  );
};
