import React, { useEffect, useState } from 'react';

export const lazyLoad = (componentImport: () => Promise<any>) => {
  return React.lazy(async () => {
    const pageAlreadyRefreshed = JSON.parse(
      window.localStorage.getItem('pageRefreshed') || 'false'
    );
    
    try {
      const component = await componentImport();
      window.localStorage.setItem('pageRefreshed', 'false');
      return component;
    } catch (error) {
      if (!pageAlreadyRefreshed) {
        window.localStorage.setItem('pageRefreshed', 'true');
        return window.location.reload();
      }
      throw error;
    }
  });
};

export const preloadComponent = (componentImport: () => Promise<any>) => {
  return componentImport();
};

export const useImageOptimization = (src: string, options = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Event | string | null>(null); // ✅ allow Event or string

  useEffect(() => {
    if (!src) return;

    const image = new Image();
    setIsLoading(true);
    setError(null);

    image.onload = () => setIsLoading(false);
    image.onerror = (err) => setError(err as Event); // ✅ cast for TS
    image.src = src;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  return { isLoading, error };
};


export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
