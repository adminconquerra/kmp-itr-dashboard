import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 focus-visible:ring-brand-500/30',
  secondary:
    'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:ring-neutral-400/30',
  ghost:
    'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 focus-visible:ring-neutral-400/30',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', type = 'button', className, ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        // Layout / typography (shared)
        'inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-semibold',
        // Interaction (shared)
        'transition focus:outline-none focus-visible:ring-2 active:scale-[0.98]',
        // Disabled (shared)
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANT_STYLES[variant],
        className,
      )}
      {...rest}
    />
  ),
);
Button.displayName = 'Button';
