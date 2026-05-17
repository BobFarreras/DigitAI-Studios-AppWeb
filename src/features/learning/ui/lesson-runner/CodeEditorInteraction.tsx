/**
 * @file src/features/learning/ui/lesson-runner/CodeEditorInteraction.tsx
 * @updated 2026-05-17
 * @summary Small code editor lesson interaction.
 * @scope Client code text area only; correctness remains server-side.
 */
import type { FeedbackStatus } from './ChoiceButton';

type Props = {
  value: string;
  language?: string;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onChange: (value: string) => void;
};

export function CodeEditorInteraction({ value, language, disabled, feedbackStatus, onChange }: Props) {
  return (
    <div className={`overflow-hidden rounded-xl border-2 bg-[#0f172a] text-white shadow-[0_4px_0_#020617] ${borderClass(feedbackStatus)}`}>
      <div className="border-b border-white/10 px-4 py-2 text-xs font-black uppercase text-[#93c5fd]">
        {language ?? 'code'}
      </div>
      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-40 w-full resize-none bg-transparent p-4 font-mono text-sm font-bold leading-6 outline-none disabled:cursor-default"
        placeholder="escriu el snippet"
      />
    </div>
  );
}

function borderClass(feedbackStatus: FeedbackStatus | undefined) {
  if (feedbackStatus === 'incorrect') return 'border-[#ff4b4b]';
  if (feedbackStatus === 'correct') return 'border-[#58cc02]';
  return 'border-[#1cb0f6]';
}
