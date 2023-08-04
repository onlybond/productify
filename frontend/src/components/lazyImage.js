import React, { useState, useEffect, useRef } from 'react';
import {CircularProgress} from '@mui/material';

const LazyImage = ({ src, alt, style ,label}) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  const imageRef = useRef();
  const progressRef = useRef();

  const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(imageRef.current);

        if (progressRef.current) {
          progressRef.current.style.display = 'none';
        }

        setLoadingProgress(100);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setLoadingProgress(100);
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{ ...style, display: loadingProgress === 100 ? 'block' : 'none' }}
        onLoad={handleImageLoad}
      />
      {loadingProgress !== 100 && (
        <div
          ref={progressRef}
          style={{
            textAlign: 'center',
          }}
        >
          <CircularProgress/>
          <p>{label}</p>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
