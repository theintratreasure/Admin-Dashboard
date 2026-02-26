"use client";

import { useRef, useState, type ReactNode } from "react";

type DragScrollProps = {
  className?: string;
  children: ReactNode;
};

const INTERACTIVE_SELECTOR =
  "button, a, input, select, textarea, label, [role=\"button\"], [data-no-drag]";

export default function DragScroll({ className, children }: DragScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const pointerDownRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest(INTERACTIVE_SELECTOR)) return;

    const container = containerRef.current;
    if (!container) return;

    pointerDownRef.current = true;
    startXRef.current = event.clientX;
    scrollLeftRef.current = container.scrollLeft;
    container.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const deltaX = event.clientX - startXRef.current;
    if (!isDragging && Math.abs(deltaX) < 6) return;

    if (!isDragging) setIsDragging(true);
    event.preventDefault();
    container.scrollLeft = scrollLeftRef.current - deltaX;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current) return;

    pointerDownRef.current = false;
    if (isDragging) setIsDragging(false);

    const container = containerRef.current;
    if (container?.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`drag-scroll ${isDragging ? "drag-scroll--dragging" : ""} ${
        className || ""
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      {children}
    </div>
  );
}
