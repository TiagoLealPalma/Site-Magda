import { useEffect, useRef, useState } from "react";

// Shows a page laid out at its real desktop width, shrunk to fit the space
// available. Inert on purpose: it is a picture of the page, not the page.
export default function ScaledPreview({ width = 1280, children }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const measure = () => {
      setScale(outer.clientWidth / width);
      setHeight(inner.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={outerRef}
      inert
      aria-hidden="true"
      className="relative overflow-hidden border border-ink/15 bg-paper"
      style={{ height: height * scale }}
    >
      <div
        ref={innerRef}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
