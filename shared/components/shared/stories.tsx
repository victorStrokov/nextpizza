'use client';

import { cn } from '@/shared/lib/utils';
import { Api } from '@/shared/services/api-client';
import { IStory } from '@/shared/services/stories';
import React from 'react';
import { Container } from './container';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ReactStories from 'react-insta-stories';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface Props {
  className?: string;
}

export const Stories: React.FC<Props> = ({ className }) => {
  const [stories, setStories] = React.useState<IStory[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedStory, setSelectedStory] = React.useState<IStory>();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    async function fetchStories() {
      const data = await Api.stories.getAll();
      setStories(data);
    }
    fetchStories();
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onClickStory = (story: IStory) => {
    setSelectedStory(story);

    if (story.items.length > 0) {
      // считаем индекс старта
      const startIndex = stories
        .slice(
          0,
          stories.findIndex((s) => s.id === story.id)
        )
        .reduce(
          (acc, st) =>
            acc + (st.items?.filter((i) => i?.sourceUrl?.trim()).length || 0),
          0
        );
      setCurrentIndex(startIndex);
      setOpen(true);
    }
  };

  // Все слайды из всех историй
  const allSlides = stories.flatMap((story) =>
    (story.items || [])
      .filter((item) => item?.sourceUrl?.trim())
      .map((item) => ({
        content: () => {
          // Проверяем, является ли ссылка item.sourceUrl видеофайлом
          // \.(mp4|webm|ogg) — ищем точку и одно из расширений mp4 / webm / ogg
          // (\?|$) — после расширения должно быть либо начало query‑параметров '?', либо конец строки
          // флаг i — игнорируем регистр, чтобы .MP4 и .mp4 считались одинаково
          const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(item.sourceUrl);

          return (
            <div className='relative w-full h-full'>
              {isVideo ? (
                <video
                  src={item.sourceUrl}
                  className='w-full h-full object-cover object-center'
                  autoPlay
                  muted
                  playsInline
                  controls={false}
                />
              ) : (
                <img
                  src={item.sourceUrl}
                  className='w-full h-full object-cover object-center'
                  alt=''
                />
              )}
            </div>
          );
        },
      }))
  );
  return (
    <>
      <Container className={cn('my-10', className)}>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={8}
          slidesPerView='auto'
          loop={true}
          freeMode={true}
          speed={3000} // скорость движения всей карусели
          allowTouchMove={true} // при загрузке данных можно включить
          autoplay={{
            delay: 0, // без паузы
            disableOnInteraction: false, // автоплей возобновляется после свайпа
            pauseOnMouseEnter: false,
          }}>
          {(stories.length === 0 ? [...Array(8)] : stories).map(
            (story, index) => (
              <SwiperSlide
                key={index}
                className='!w-[120px] sm:!w-[160px] lg:!w-[200px]'>
                {stories.length === 0 ? (
                  <div className='skeleton-shimmer w-full h-full rounded-md' />
                ) : (
                  <img
                    onClick={() => onClickStory(story)}
                    className='w-full h-full object-cover rounded-md cursor-pointer'
                    src={story.previewImageUrl}
                    alt=''
                  />
                )}
              </SwiperSlide>
            )
          )}
        </Swiper>
      </Container>

      {open && (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-30'>
          <div className='relative w-full max-w-[360px] aspect-[9/16] rounded-xl overflow-hidden'>
            {/* Крестик закрытия */}
            <button
              className='absolute top-2 right-2 z-[99999]'
              onClick={() => setOpen(false)}>
              <X className='w-8 h-8 text-white/80 hover:text-white transition' />
            </button>

            {/* Сам плеер */}
            <ReactStories
              key={selectedStory?.id}
              onAllStoriesEnd={() => setOpen(false)}
              stories={allSlides}
              currentIndex={currentIndex}
              defaultInterval={3000}
              width='100%'
              height='100%'
              storyStyles={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
              }}
            />

            {/* Левая стрелка */}
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className='absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white z-[99999]'>
              <ChevronLeft className='w-6 h-6' />
            </button>

            {/* Правая стрелка */}
            <button
              onClick={() =>
                setCurrentIndex((i) => Math.min(allSlides.length - 1, i + 1))
              }
              className='absolute right-1  top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white z-[9999]'>
              <ChevronRight className='w-6 h-6' />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
