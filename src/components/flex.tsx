import { type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type FlexDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse';
type FlexAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

interface FlexProps extends ComponentProps<'div'> {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: boolean;
}

const DIRECTION_MAP: Record<FlexDirection, string> = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

const ALIGN_MAP: Record<FlexAlign, string> = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const JUSTIFY_MAP: Record<FlexJustify, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export function Flex({
  direction,
  align,
  justify,
  wrap,
  className,
  children,
  ...rest
}: Readonly<FlexProps>) {
  return (
    <div
      className={cn(
        'flex',
        direction && DIRECTION_MAP[direction],
        align && ALIGN_MAP[align],
        justify && JUSTIFY_MAP[justify],
        wrap && 'flex-wrap',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
