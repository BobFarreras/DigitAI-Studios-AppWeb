/**
 * @file src/features/learning/ui/lesson-runner/CodeChoiceInteraction.tsx
 * @updated 2026-05-17
 * @summary Code snippet choice lesson interaction.
 * @scope Client code option UI only; correctness remains server-side.
 */
import type { FeedbackStatus } from './ChoiceButton';

type CodeOption = { label: string; code: string };

type Props = {
  options: CodeOption[];
  value: string | undefined;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onChange: (value: string) => void;
};

export function CodeChoiceInteraction({ options, value, disabled, feedbackStatus, onChange }: Props) {
  return (
    <div className="grid gap-3">
      {options.map((option) => {
        const active = value === option.label;
        return (
          <button
            key={option.label}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.label)}
            className={`rounded-xl border-2 p-0 text-left transition active:translate-y-1 disabled:cursor-default ${buttonStateClass(active, feedbackStatus)}`}
          >
            <span className="block border-b-2 border-inherit px-4 py-2 text-sm font-black">{option.label}</span>
            <pre className="overflow-x-auto p-4 text-sm font-bold leading-6"><code>{option.code}</code></pre>
          </button>
        );
      })}
    </div>
  );
}

function buttonStateClass(active: boolean, feedbackStatus: FeedbackStatus | undefined) {
  if (!active) return 'border-[#e5e5e5] bg-white text-[#3c3c3c] shadow-[0_4px_0_#e5e5e5]';
  if (feedbackStatus === 'incorrect') return 'border-[#ff4b4b] bg-[#ffdfe0] text-[#3c3c3c]';
  if (feedbackStatus === 'correct') return 'border-[#58cc02] bg-[#d7ffb8] text-[#3c3c3c]';
  return 'border-[#1cb0f6] bg-[#ddf4ff] text-[#3c3c3c]';
}
