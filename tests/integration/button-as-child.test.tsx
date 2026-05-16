/**
 * @file tests/integration/button-as-child.test.tsx
 * @updated 2026-05-16
 * @summary Integration test for Button asChild composition.
 * @scope Ensures asChild does not leak invalid DOM attributes.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button asChild', () => {
  it('renders the child element without leaking asChild to the DOM', () => {
    render(
      <Button asChild>
        <a href="https://example.com">Dashboard</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });

    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).not.toHaveAttribute('asChild');
    expect(document.querySelector('button')).toBeNull();
  });
});
