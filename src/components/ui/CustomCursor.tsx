/**
 * @file src/components/ui/CustomCursor.tsx
 * @updated 2026-08-19
 * @summary Cursor visual custom amb rendiment adaptatiu. Es desactiva si FPS < 45.
 * @scope Millora visual client-side sense lligam amb logica de negoci.
 */
'use client';

import { useEffect, useRef, useState } from 'react';

type CursorMode = 'default' | 'action' | 'text';

function getCursorLabel(target: EventTarget | null): string {
  if (!(target instanceof Element)) return '';
  return target.closest('[data-cursor-label]')?.getAttribute('data-cursor-label') ?? '';
}

function getCursorMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return 'default';
  if (target.closest('input, textarea, [contenteditable="true"], [data-cursor="text"]')) return 'text';
  if (target.closest('a, button, select, summary, label, [role="button"], [data-cursor="action"]')) return 'action';
  return 'default';
}

function measureFps(): Promise<number> {
  return new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    const tick = () => {
      frames += 1;
      if (performance.now() - start >= 1000) {
        resolve(frames);
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) return;
    const canUseCursor = window.matchMedia('(pointer: fine)').matches;
    if (!canUseCursor) return;

    const hardwareOk = navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency >= 4
      : true;
    if (!hardwareOk) return;

    measureFps().then((fps) => {
      if (fps >= 45) setEnabled(true);
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = cursorRef.current;
    if (!el) return;

    document.body.classList.add('custom-cursor-enabled');
    let mode: CursorMode = 'default';
    let label = '';
    let pressed = false;
    let visible = false;
    const labelEl = el.querySelector<HTMLElement>('.custom-cursor__label');

    const syncClasses = () => {
      el.className = [
        'custom-cursor',
        `custom-cursor--${mode}`,
        label ? 'has-label' : '',
        pressed ? 'is-pressed' : '',
        visible ? 'is-visible' : '',
      ].join(' ');
    };

    const updatePosition = (event: PointerEvent) => {
      el.style.setProperty('--cursor-x', `${event.clientX}px`);
      el.style.setProperty('--cursor-y', `${event.clientY}px`);
      const newMode = getCursorMode(event.target);
      const newLabel = getCursorLabel(event.target);
      if (newMode !== mode || newLabel !== label || !visible) {
        mode = newMode;
        label = newLabel;
        if (labelEl) labelEl.textContent = label;
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
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="custom-cursor">
      <span className="custom-cursor__ring" />
      <span className="custom-cursor__dot" />
      <span className="custom-cursor__label" />
    </div>
  );
}
