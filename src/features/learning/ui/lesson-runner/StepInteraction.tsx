/**
 * @file src/features/learning/ui/lesson-runner/StepInteraction.tsx
 * @updated 2026-05-17
 * @summary Renders supported lesson exercise interactions.
 * @scope Client UI controls only; correctness is server-side.
 */
import type { LearningRunnerStep } from '@/services/learning/learning-lesson-service';
import { ChoiceButton, type FeedbackStatus } from './ChoiceButton';
type Props = {
  step: LearningRunnerStep;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
};

export function StepInteraction({ step, value, onChange, disabled, feedbackStatus }: Props) {
  if (step.type === 'order_steps') {
    return (
      <OrderSteps
        options={asStringArray(step.config.options)}
        value={asStringArray(value)}
        onChange={onChange}
        disabled={disabled}
        feedbackStatus={feedbackStatus}
      />
    );
  }
  if (step.type === 'match_pairs') {
    return (
      <MatchPairs
        pairs={asPairs(step.config.options)}
        value={asRecord(value)}
        onChange={onChange}
        disabled={disabled}
        feedbackStatus={feedbackStatus}
      />
    );
  }

  return (
    <div className="grid gap-3">
      {asStringArray(step.config.options).map((option) => (
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

function OrderSteps({
  options,
  value,
  onChange,
  disabled,
  feedbackStatus,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
}) {
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

function MatchPairs({
  pairs,
  value,
  onChange,
  disabled,
  feedbackStatus,
}: {
  pairs: Array<{ left: string; right: string[] }>;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
}) {
  return (
    <div className="space-y-5">
      {pairs.map((pair) => (
        <div key={pair.left}>
          <p className="mb-2 text-sm font-black uppercase text-[#777777]">{pair.left}</p>
          <div className="grid gap-2">
            {pair.right.map((option) => (
              <ChoiceButton
                key={option}
                active={value[pair.left] === option}
                disabled={disabled}
                feedbackStatus={value[pair.left] === option ? feedbackStatus : undefined}
                onClick={() => onChange({ ...value, [pair.left]: option })}
              >
                {option}
              </ChoiceButton>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asPairs(value: unknown): Array<{ left: string; right: string[] }> {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is { left: string; right: string[] } => typeof item?.left === 'string' && Array.isArray(item.right));
}
