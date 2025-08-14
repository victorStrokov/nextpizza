'use client';

import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/shared/lib/utils';

type SliderProps = {
  className?: string;
  min: number;
  max: number;
  step: number;
  formatLabel?: (value: number) => string;
  value?: number[] | readonly number[];
  onValueChange?: (values: number[]) => void;
};

const RangeSlider = React.forwardRef(
  (
    {
      className,
      min,
      max,
      step,
      formatLabel,
      value,
      onValueChange,
      ...props
    }: SliderProps,
    ref
  ) => {
    const initialValue = Array.isArray(value) ? value : [min, max];
    const [localValues, setLocalValues] = React.useState(initialValue);

    React.useEffect(() => {
      // Update localValues when the external value prop changes
      setLocalValues(Array.isArray(value) ? value : [min, max]);
    }, [min, max, value]);

    const handleValueChange = (newValues: number[]) => {
      setLocalValues(newValues);
      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    return (
      <div className={cn(' w-full relative', className)}>
        <SliderPrimitive.Root
          ref={ref as React.RefObject<HTMLDivElement>}
          min={min}
          max={max}
          step={step}
          value={localValues}
          onValueChange={handleValueChange}
          className={cn(
            'relative flex w-full touch-none select-none mb-6 items-center',
            className
          )}
          {...props}>
          <SliderPrimitive.Track className='relative h-1 w-full grow overflow-hidden rounded-full bg-primary/20'>
            <SliderPrimitive.Range className='absolute h-full bg-primary' />
          </SliderPrimitive.Track>
          {localValues.map((value, index) => (
            <React.Fragment key={index}>
              <div
                className='absolute text-center'
                style={{
                  left: `clamp(0%, ${((value - min) / (max - min)) * 100}%, 100%)`,
                  top: '24px',
                  transform: 'translateX(-50%)',
                }}>
                <span className='text-sm sm:text-base text-muted-foreground'>
                  {formatLabel ? formatLabel(value) : value}
                </span>
              </div>
              <SliderPrimitive.Thumb className='block h-4 w-4 rounded-full border border-primary/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' />
            </React.Fragment>
          ))}
        </SliderPrimitive.Root>
      </div>
    );
  }
);

RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
