/**
 * @file src/features/learning/ui/lesson-runner/ChoiceButton.tsx
 * @updated 2026-05-17
 * @summary Reusable lesson choice button with feedback states.
 * @scope Presentational button only.
 */
import type { ReactNode } from 'react';

export type FeedbackStatus = 'correct' | 'incorrect';

type Props = {
  active: boolean;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onClick: () => void;
  children: ReactNode;
};

export function ChoiceButton({ active, disabled, feedbackStatus, onClick, children }: Props) {
  const activeClass = buttonStateClass(feedbackStatus);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-14 items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-base font-black transition active:translate-y-1 disabled:cursor-default ${active ? activeClass : 'border-[#e5e5e5] bg-white text-[#3c3c3c] shadow-[0_4px_0_#e5e5e5]'}`}
    >
      <span>{children}</span>
    </button>
  );
}

function buttonStateClass(feedbackStatus: FeedbackStatus | undefined) {
  if (feedbackStatus === 'incorrect') return 'border-[#ff4b4b] bg-[#ffdfe0] text-[#3c3c3c]';
  if (feedbackStatus === 'correct') return 'border-[#58cc02] bg-[#d7ffb8] text-[#3c3c3c]';
  return 'border-[#1cb0f6] bg-[#ddf4ff] text-[#3c3c3c]';
}
