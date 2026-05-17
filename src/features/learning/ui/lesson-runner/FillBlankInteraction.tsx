/**
 * @file src/features/learning/ui/lesson-runner/FillBlankInteraction.tsx
 * @updated 2026-05-17
 * @summary Fill-in-the-blank lesson interaction.
 * @scope Client text input only; correctness remains server-side.
 */
import type { FeedbackStatus } from './ChoiceButton';

type Props = {
  value: string;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function FillBlankInteraction({ value, disabled, feedbackStatus, placeholder, onChange }: Props) {
  return (
    <input
      value={value}
      disabled={disabled}
      placeholder={placeholder ?? 'Escriu la resposta'}
      onChange={(event) => onChange(event.target.value)}
      className={`min-h-14 w-full rounded-xl border-2 px-4 text-base font-black outline-none transition disabled:cursor-default ${inputStateClass(feedbackStatus)}`}
    />
  );
}

function inputStateClass(feedbackStatus: FeedbackStatus | undefined) {
  if (feedbackStatus === 'incorrect') return 'border-[#ff4b4b] bg-[#ffdfe0] text-[#3c3c3c]';
  if (feedbackStatus === 'correct') return 'border-[#58cc02] bg-[#d7ffb8] text-[#3c3c3c]';
  return 'border-[#1cb0f6] bg-[#ddf4ff] text-[#3c3c3c] focus:border-[#1cb0f6]';
}
