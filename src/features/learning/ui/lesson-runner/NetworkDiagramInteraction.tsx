/**
 * @file src/features/learning/ui/lesson-runner/NetworkDiagramInteraction.tsx
 * @updated 2026-05-17
 * @summary Network diagram choice interaction.
 * @scope Client topology selection only; correctness remains server-side.
 */
import { ChoiceButton, type FeedbackStatus } from './ChoiceButton';

type DiagramOption = { label: string; description: string };

type Props = {
  options: DiagramOption[];
  value: string | undefined;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onChange: (value: string) => void;
};

export function NetworkDiagramInteraction({ options, value, disabled, feedbackStatus, onChange }: Props) {
  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <ChoiceButton
          key={option.label}
          active={value === option.label}
          disabled={disabled}
          feedbackStatus={value === option.label ? feedbackStatus : undefined}
          onClick={() => onChange(option.label)}
        >
          <span className="block">
            <span className="block">{option.label}</span>
            <span className="block text-sm font-bold text-[#777777]">{option.description}</span>
          </span>
        </ChoiceButton>
      ))}
    </div>
  );
}
