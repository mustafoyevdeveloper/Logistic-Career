import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dark?: boolean;
}

export default function Logo({ 
  variant = 'full', 
  size = 'md', 
  className,
  dark = false 
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  if (variant === 'icon') {
    return (
      <img 
        src="/favicon.jpg" 
        alt="Asliddin Logistics Logo" 
        className={cn(sizeClasses[size], 'rounded-full', className)}
      />
    );
  }

  if (variant === 'text') {
    return (
      <span className={cn('font-bold text-foreground', textSizes[size], className)}>
        Asliddin Logistics
      </span>
    );
  }

  // Full logo
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img 
        src="/favicon.jpg" 
        alt="Asliddin Logistics - Logistika O'quv Markazi" 
        className="h-10"
      />
    </div>
  );
}

