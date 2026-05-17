/**
 * @file src/features/learning/ui/lesson-runner/StepInteraction.tsx
 * @updated 2026-05-17
 * @summary Renders supported lesson exercise interactions.
 * @scope Client UI controls only; correctness is server-side.
 */
import type { LearningRunnerStep } from '@/services/learning/learning-lesson-service';
import { CodeChoiceInteraction } from './CodeChoiceInteraction';
import { ChoiceButton, type FeedbackStatus } from './ChoiceButton';
import { FillBlankInteraction } from './FillBlankInteraction';
import { MatchPairsInteraction } from './MatchPairsInteraction';
import { MultiSelectInteraction } from './MultiSelectInteraction';
import { OrderStepsInteraction } from './OrderStepsInteraction';
type Props = {
  step: LearningRunnerStep;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
};

export function StepInteraction({ step, value, onChange, disabled, feedbackStatus }: Props) {
  if (step.type === 'multi_select') {
    return (
      <MultiSelectInteraction
        options={asStringArray(step.config.options)}
        value={asStringArray(value)}
        disabled={disabled}
        feedbackStatus={feedbackStatus}
        onChange={onChange}
      />
    );
  }
  if (step.type === 'fill_blank') {
    return (
      <FillBlankInteraction
        value={typeof value === 'string' ? value : ''}
        disabled={disabled}
        feedbackStatus={feedbackStatus}
        placeholder={typeof step.config.placeholder === 'string' ? step.config.placeholder : undefined}
        onChange={onChange}
      />
    );
  }
  if (step.type === 'code_choice') {
    return (
      <CodeChoiceInteraction
        options={asCodeOptions(step.config.options)}
        value={typeof value === 'string' ? value : undefined}
        disabled={disabled}
        feedbackStatus={feedbackStatus}
        onChange={onChange}
      />
    );
  }
  if (step.type === 'order_steps') {
    return (
      <OrderStepsInteraction
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
      <MatchPairsInteraction
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

function asCodeOptions(value: unknown): Array<{ label: string; code: string }> {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is { label: string; code: string } => typeof item?.label === 'string' && typeof item.code === 'string');
}
