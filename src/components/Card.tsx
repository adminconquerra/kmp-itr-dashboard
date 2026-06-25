import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Adds cursor pointer, hover lift, and hover shadow. */
  interactive?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-neutral-200 bg-white p-5',
        interactive &&
          'cursor-pointer transition hover:-translate-y-px hover:border-neutral-300 hover:shadow-card-hover',
        className,
      )}
      {...rest}
    />
  ),
);
Card.displayName = 'Card';
