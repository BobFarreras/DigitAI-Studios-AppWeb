/**
 * @file src/features/learning/ui/lesson-runner/MultiSelectInteraction.tsx
 * @updated 2026-05-17
 * @summary Multi-select lesson interaction.
 * @scope Client selection UI only; correctness remains server-side.
 */
import { ChoiceButton, type FeedbackStatus } from './ChoiceButton';

type Props = {
  options: string[];
  value: string[];
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onChange: (value: string[]) => void;
};

export function MultiSelectInteraction({ options, value, disabled, feedbackStatus, onChange }: Props) {
  return (
    <div className="grid gap-3">
      {options.map((option) => {
        const active = value.includes(option);
        return (
          <ChoiceButton
            key={option}
            active={active}
            disabled={disabled}
            feedbackStatus={active ? feedbackStatus : undefined}
            onClick={() => onChange(toggleOption(value, option))}
          >
            {option}
          </ChoiceButton>
        );
      })}
    </div>
  );
}

function toggleOption(value: string[], option: string) {
  return value.includes(option) ? value.filter((item) => item !== option) : [...value, option];
}
