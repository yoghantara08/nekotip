import { useEffect, useState } from "react";

export interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
}

const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 1024 : false,
    isTablet: typeof window !== "undefined" ? window.innerWidth < 1024 : false,
  });

  const handleResize = () => {
    const mobile = window.innerWidth !== 0 && window.innerWidth < 1024;
    const tablet = window.innerWidth !== 0 && window.innerWidth < 1024;
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: mobile,
      isTablet: tablet,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
