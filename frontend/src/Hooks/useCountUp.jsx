import { useState, useEffect } from 'react';

const useCountUp = (endValue, isVisible) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = endValue / (duration / 10);

      const timer = setInterval(() => {
        start += increment;
        if (start >= endValue) {
          clearInterval(timer);
          setCount(endValue);
        } else {
          setCount(Math.ceil(start));
        }
      }, 10);

      return () => clearInterval(timer); // Cleanup the interval on unmount
    }
  }, [endValue, isVisible]);

  return count;
};

export default useCountUp;