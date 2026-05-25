/**
 * @file src/components/ui/CustomCursor.tsx
 * @updated 2026-05-25
 * @summary Cursor visual custom amb estats per click, accio i text. Zero React re-renders.
 * @scope Millora visual client-side sense lligam amb logica de negoci.
 */
'use client';

import { useEffect, useRef } from 'react';

type CursorMode = 'default' | 'action' | 'text';

function getCursorMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return 'default';
  if (target.closest('input, textarea, [contenteditable="true"], [data-cursor="text"]')) return 'text';
  if (target.closest('a, button, select, summary, label, [role="button"], [data-cursor="action"]')) return 'action';
  return 'default';
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canUseCursor = window.matchMedia('(pointer: fine)').matches;
    if (!canUseCursor) return;

    document.body.classList.add('custom-cursor-enabled');
    const el = cursorRef.current;
    if (!el) return;

    let mode: CursorMode = 'default';
    let pressed = false;
    let visible = false;

    const syncClasses = () => {
      el.className = [
        'custom-cursor',
        `custom-cursor--${mode}`,
        pressed ? 'is-pressed' : '',
        visible ? 'is-visible' : '',
      ].join(' ');
    };

    const updatePosition = (event: PointerEvent) => {
      el.style.setProperty('--cursor-x', `${event.clientX}px`);
      el.style.setProperty('--cursor-y', `${event.clientY}px`);
      const newMode = getCursorMode(event.target);
      if (newMode !== mode || !visible) {
        mode = newMode;
        visible = true;
        syncClasses();
      }
    };

    const setPressed = () => { pressed = true; syncClasses(); };
    const unsetPressed = () => { pressed = false; syncClasses(); };
    const hideCursor = () => { visible = false; syncClasses(); };
    const showCursor = () => { visible = true; syncClasses(); };

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

  return (
    <div ref={cursorRef} className="custom-cursor">
      <span className="custom-cursor__ring" />
      <span className="custom-cursor__dot" />
    </div>
  );
}
