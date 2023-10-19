import { useEffect, useRef } from "react";
const usePrevious = (value: any) => {
  const ref = useRef<typeof value>();

  useEffect(() => {
    ref.current = value;
  });

  if (ref.current === undefined) {
    return undefined;
  }
  if (!ref.current) return undefined;
  return ref.current;
};

export default usePrevious;
