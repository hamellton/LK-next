import { useEffect, useState, useMemo, useCallback } from "react";

const useDimensions = ({element, conversionFn}: any) => {
    const memoisedFn = useCallback(conversionFn, []);
    const [dimensions, setDimensions] = useState({width: 0, height: 0, operatedVal: 0});
    useEffect(() => {
      if(element?.offsetWidth && element?.offsetHeight) setDimensions({width: element?.offsetWidth, height: element?.offsetHeight, operatedVal: memoisedFn ? memoisedFn(element?.offsetWidth, element?.offsetHeight) : 0})
      function handleResize() {
        setDimensions({
            width: element?.offsetWidth,
            height: element?.offsetHeight,
            operatedVal: memoisedFn && element?.offsetWidth && element?.offsetHeight ? memoisedFn(element.offsetWidth, element.offsetHeight) : 0
        });
      }
      if(window) window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      }
    }, [element, memoisedFn]);
    return dimensions;
}

export default useDimensions;