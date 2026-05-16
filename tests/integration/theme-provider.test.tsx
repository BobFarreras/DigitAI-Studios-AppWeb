/**
 * @file tests/integration/theme-provider.test.tsx
 * @updated 2026-05-16
 * @summary Integration tests for the custom theme provider.
 * @scope Ensures theme switching works without rendering script tags.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

describe('ThemeProvider', () => {
  it('toggles dark class without rendering scripts', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(document.querySelector('script')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Canviar tema' }));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
