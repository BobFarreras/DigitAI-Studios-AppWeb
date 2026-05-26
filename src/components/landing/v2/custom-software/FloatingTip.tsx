/**
 * @file src/components/landing/v2/custom-software/FloatingTip.tsx
 * @updated 2026-05-13
 * @summary Tooltip flotant fora del contenidor del simulador.
 * @scope Mostrar ajuda contextual sense quedar retallada per overflow.
 */
'use client';
import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Props = { text: string; children: ReactNode; className?: string };
type Position = { left: number; top: number } | null;

export function FloatingTip({ text, children, className }: Props) {
  const [position, setPosition] = useState<Position>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClick = useRef(false);
  const close = () => setPosition(null);
  const clearPressTimer = () => {
    if (!pressTimer.current) return;
    clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };
  const open = (target: EventTarget & HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setPosition({ left: rect.left + rect.width / 2, top: rect.bottom + 8 });
  };
  const startLongPress = (target: EventTarget & HTMLElement) => {
    clearPressTimer();
    suppressClick.current = false;
    pressTimer.current = setTimeout(() => {
      suppressClick.current = true;
      open(target);
    }, 700);
  };
  const endLongPress = () => {
    clearPressTimer();
    close();
  };

  return (
    <span
      className={className ?? 'inline-flex'}
      onBlur={close}
      onClick={(event) => {
        if (!suppressClick.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      }}
      onPointerCancel={endLongPress}
      onPointerDown={(event) => startLongPress(event.currentTarget)}
      onPointerLeave={endLongPress}
      onPointerUp={endLongPress}
    >
      {children}
      {position
        ? createPortal(
            <span
              className="pointer-events-none fixed z-[9999] w-max max-w-56 -translate-x-1/2 rounded-[7px] border border-[#c0c8d5] bg-white px-2.5 py-1.5 text-[11px] leading-4 text-[#383b3f] shadow-[0_16px_42px_rgba(8,9,10,0.18)] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0]"
              style={{ left: position.left, top: position.top }}
            >
              {text}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
