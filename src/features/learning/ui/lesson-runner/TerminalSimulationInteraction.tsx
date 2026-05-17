/**
 * @file src/features/learning/ui/lesson-runner/TerminalSimulationInteraction.tsx
 * @updated 2026-05-17
 * @summary Terminal command lesson interaction.
 * @scope Client terminal-style input only; correctness remains server-side.
 */
import type { FeedbackStatus } from './ChoiceButton';

type Props = {
  value: string;
  promptLabel?: string;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onChange: (value: string) => void;
};

export function TerminalSimulationInteraction({ value, promptLabel, disabled, feedbackStatus, onChange }: Props) {
  return (
    <div className={`rounded-xl border-2 bg-[#111827] p-4 font-mono shadow-[0_4px_0_#0f172a] ${borderClass(feedbackStatus)}`}>
      <label className="mb-3 block text-xs font-bold uppercase text-[#93c5fd]">{promptLabel ?? 'terminal'}</label>
      <div className="flex items-center gap-2 text-sm text-white">
        <span className="text-[#58cc02]">$</span>
        <input
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-10 flex-1 bg-transparent font-bold outline-none disabled:cursor-default"
          placeholder="escriu una comanda"
        />
      </div>
    </div>
  );
}

function borderClass(feedbackStatus: FeedbackStatus | undefined) {
  if (feedbackStatus === 'incorrect') return 'border-[#ff4b4b]';
  if (feedbackStatus === 'correct') return 'border-[#58cc02]';
  return 'border-[#1cb0f6]';
}
