"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties, type JSX, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger index for grouped reveals. */
  index?: number;
  as?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
};

/**
 * Fade/rise-in on scroll. The initial hidden state is gated behind the `js`
 * class (see root layout), so content is fully visible without JavaScript or
 * with reduced motion.
 */
export default function Reveal({ children, className, index, as = "div", style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const props = {
    ref,
    "data-reveal": "",
    className: `${className ?? ""} ${visible ? "is-visible" : ""}`.trim(),
    style: { ...style, ...(index !== undefined ? { "--i": index } : undefined) } as CSSProperties,
  };

  return createElement(as, props, children);
}
