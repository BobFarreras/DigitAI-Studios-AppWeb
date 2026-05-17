/**
 * @file src/features/learning/ui/lesson-runner/SecurityTriageInteraction.tsx
 * @updated 2026-05-17
 * @summary Security severity triage interaction.
 * @scope Client severity selection only; correctness remains server-side.
 */
import { ChoiceButton, type FeedbackStatus } from './ChoiceButton';

type Props = {
  options: string[];
  value: string | undefined;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onChange: (value: string) => void;
};

export function SecurityTriageInteraction({ options, value, disabled, feedbackStatus, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <ChoiceButton
          key={option}
          active={value === option}
          disabled={disabled}
          feedbackStatus={value === option ? feedbackStatus : undefined}
          onClick={() => onChange(option)}
        >
          {option}
        </ChoiceButton>
      ))}
    </div>
  );
}
