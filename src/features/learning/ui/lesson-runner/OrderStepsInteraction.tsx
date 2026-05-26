/**
 * @file src/features/learning/ui/lesson-runner/OrderStepsInteraction.tsx
 * @updated 2026-05-17
 * @summary Ordered steps lesson interaction.
 * @scope Client ordering UI only; correctness remains server-side.
 */
import { ChoiceButton, type FeedbackStatus } from './ChoiceButton';

type Props = {
  options: string[];
  value: string[];
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onChange: (value: string[]) => void;
};

export function OrderStepsInteraction({ options, value, disabled, feedbackStatus, onChange }: Props) {
  const remaining = options.filter((option) => !value.includes(option));
  return (
    <div className="space-y-5">
      <div className="min-h-24 rounded-xl border-2 border-dashed border-[#e5e5e5] p-3">
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <ChoiceButton
              key={item}
              active
              disabled={disabled}
              feedbackStatus={feedbackStatus}
              onClick={() => onChange(value.filter((current) => current !== item))}
            >
              {item}
            </ChoiceButton>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        {remaining.map((option) => (
          <ChoiceButton key={option} active={false} disabled={disabled} onClick={() => onChange([...value, option])}>
            {option}
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}
