import { useEffect, useState } from "react";

function useBreakpoint() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  if (w < 640) return "mobile" as const;
  if (w < 1024) return "tablet" as const;
  return "desktop" as const;
}

export default useBreakpoint;
