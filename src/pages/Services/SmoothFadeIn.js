import React, { useRef, useEffect, useState } from 'react';

export default function SmoothFadeIn({children}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // observer.unobserve(entry.target);
          }else{
            setIsVisible(false);
          }
        });
      });
  
      if (ref.current) {
        observer.observe(ref.current);
      }
  
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        //   setIsVisible(false);
        }
      };
    }, );
 
    return (
        <div
        ref={ref}
        className={`transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
  )
}
