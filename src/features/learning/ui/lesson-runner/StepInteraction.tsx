/**
 * @file src/features/learning/ui/lesson-runner/StepInteraction.tsx
 * @updated 2026-05-16
 * @summary Renders supported lesson exercise interactions.
 * @scope Client UI controls only; correctness is server-side.
 */
import { CheckCircle2 } from 'lucide-react';
import type { LearningRunnerStep } from '@/services/learning/learning-lesson-service';

type Props = {
  step: LearningRunnerStep;
  value: unknown;
  onChange: (value: unknown) => void;
};

export function StepInteraction({ step, value, onChange }: Props) {
  if (step.type === 'order_steps') {
    return <OrderSteps options={asStringArray(step.config.options)} value={asStringArray(value)} onChange={onChange} />;
  }
  if (step.type === 'match_pairs') {
    return <MatchPairs pairs={asPairs(step.config.options)} value={asRecord(value)} onChange={onChange} />;
  }

  return (
    <div className="grid gap-3">
      {asStringArray(step.config.options).map((option) => (
        <ChoiceButton key={option} active={value === option} onClick={() => onChange(option)}>
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
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const remaining = options.filter((option) => !value.includes(option));
  return (
    <div className="space-y-5">
      <div className="min-h-24 rounded-xl border-2 border-dashed border-[#e5e5e5] p-3">
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <ChoiceButton key={item} active onClick={() => onChange(value.filter((current) => current !== item))}>
              {item}
            </ChoiceButton>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        {remaining.map((option) => (
          <ChoiceButton key={option} active={false} onClick={() => onChange([...value, option])}>
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
}: {
  pairs: Array<{ left: string; right: string[] }>;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-5">
      {pairs.map((pair) => (
        <div key={pair.left}>
          <p className="mb-2 text-sm font-black uppercase text-[#777777]">{pair.left}</p>
          <div className="grid gap-2">
            {pair.right.map((option) => (
              <ChoiceButton key={option} active={value[pair.left] === option} onClick={() => onChange({ ...value, [pair.left]: option })}>
                {option}
              </ChoiceButton>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-base font-black transition active:translate-y-1 ${active ? 'border-[#58cc02] bg-[#d7ffb8] text-[#3c3c3c]' : 'border-[#e5e5e5] bg-white text-[#3c3c3c] shadow-[0_4px_0_#e5e5e5]'}`}
    >
      <span>{children}</span>
      {active ? <CheckCircle2 className="h-5 w-5 text-[#58cc02]" /> : null}
    </button>
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
  return value.filter((item): item is { left: string; right: string[] } =>
    typeof item?.left === 'string' && Array.isArray(item.right)
  );
}
