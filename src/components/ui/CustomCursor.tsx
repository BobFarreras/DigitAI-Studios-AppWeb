/**
 * @file src/components/ui/CustomCursor.tsx
 * @updated 2026-05-12
 * @summary Cursor visual custom amb estats per click, accio i text.
 * @scope Millora visual client-side sense lligam amb logica de negoci.
 */
'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

type CursorMode = 'default' | 'action' | 'text';

type CursorState = {
  x: number;
  y: number;
  mode: CursorMode;
  pressed: boolean;
  visible: boolean;
};

type CursorStyle = CSSProperties & {
  '--cursor-x': string;
  '--cursor-y': string;
};

const initialState: CursorState = {
  x: 0,
  y: 0,
  mode: 'default',
  pressed: false,
  visible: false,
};

function getCursorMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return 'default';
  if (target.closest('input, textarea, [contenteditable="true"], [data-cursor="text"]')) return 'text';
  if (target.closest('a, button, select, summary, label, [role="button"], [data-cursor="action"]')) return 'action';
  return 'default';
}

export function CustomCursor() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const canUseCursor = window.matchMedia('(pointer: fine)').matches;
    if (!canUseCursor) return;

    document.body.classList.add('custom-cursor-enabled');

    const updatePosition = (event: PointerEvent) => {
      setState((current) => ({
        ...current,
        x: event.clientX,
        y: event.clientY,
        mode: getCursorMode(event.target),
        visible: true,
      }));
    };

    const setPressed = () => setState((current) => ({ ...current, pressed: true }));
    const unsetPressed = () => setState((current) => ({ ...current, pressed: false }));
    const hideCursor = () => setState((current) => ({ ...current, visible: false }));
    const showCursor = () => setState((current) => ({ ...current, visible: true }));

    window.addEventListener('pointermove', updatePosition);
    window.addEventListener('pointerdown', setPressed);
    window.addEventListener('pointerup', unsetPressed);
    window.addEventListener('blur', hideCursor);
    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('mouseenter', showCursor);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      window.removeEventListener('pointermove', updatePosition);
      window.removeEventListener('pointerdown', setPressed);
      window.removeEventListener('pointerup', unsetPressed);
      window.removeEventListener('blur', hideCursor);
      document.removeEventListener('mouseleave', hideCursor);
      document.removeEventListener('mouseenter', showCursor);
    };
  }, []);

  const className = [
    'custom-cursor',
    `custom-cursor--${state.mode}`,
    state.pressed ? 'is-pressed' : '',
    state.visible ? 'is-visible' : '',
  ].join(' ');

  const style: CursorStyle = {
    '--cursor-x': `${state.x}px`,
    '--cursor-y': `${state.y}px`,
  };

  return (
    <div className={className} style={style}>
      <span className="custom-cursor__ring" />
      <span className="custom-cursor__dot" />
    </div>
  );
}
