import { useState, useEffect } from 'react';
import { BG_IMAGES } from '@/constants';

interface Props {
  className?: string;
  overlayOpacity?: number;
}

export default function BackgroundSlideshow({ className = '', overlayOpacity = 0.85 }: Props) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % BG_IMAGES.length);
        setNext((n) => (n + 1) % BG_IMAGES.length);
        setTransitioning(false);
      }, 1000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <img
        src={BG_IMAGES[current]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 1s ease' }}
        loading="lazy"
      />
      <img
        src={BG_IMAGES[next]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: transitioning ? 1 : 0, transition: 'opacity 1s ease' }}
        loading="lazy"
      />
      <div
        className="absolute inset-0"
        style={{ background: `rgba(10,10,10,${overlayOpacity})` }}
      />
    </div>
  );
}
