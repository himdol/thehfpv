import { useState, useEffect } from 'react';

interface UseCounterProps {
  end: number;
  duration?: number;
  start?: number;
  suffix?: string;
  prefix?: string;
  trigger?: boolean;
}

export const useCounter = ({ 
  end, 
  duration = 2000, 
  start = 0, 
  suffix = '', 
  prefix = '',
  trigger = true
}: UseCounterProps) => {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!trigger || hasAnimated) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };

    // Small delay to ensure smooth start
    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, trigger, hasAnimated]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toLocaleString();
  };

  return `${prefix}${formatNumber(count)}${suffix}`;
};
