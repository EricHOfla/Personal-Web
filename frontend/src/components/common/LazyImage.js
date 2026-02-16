// LazyImage.js - Lazy loading image component with loading placeholder

import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  onLoad,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && src) {
            // Start loading image
            const img = new Image();
            img.src = src;
            
            img.onload = () => {
              setImageSrc(src);
              setIsLoading(false);
              if (onLoad) onLoad();
            };
            
            img.onerror = () => {
              setHasError(true);
              setIsLoading(false);
            };
            
            // Stop observing after loading starts
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, onLoad]);

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`${className} bg-gray-800 flex items-center justify-center text-gray-500 text-sm`}
        {...props}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div 
          ref={imgRef}
          className={`${placeholderClassName || className} bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse`}
          {...props}
        />
      )}
      {imageSrc && (
        <img
          ref={!isLoading ? imgRef : null}
          src={imageSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'hidden' : 'block'}`}
          {...props}
        />
      )}
    </>
  );
};

export default LazyImage;
