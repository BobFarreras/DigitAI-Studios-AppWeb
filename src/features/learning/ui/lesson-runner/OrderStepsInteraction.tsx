/**
 * @file src/features/learning/ui/lesson-runner/OrderStepsInteraction.tsx
 * @updated 2026-05-23
 * @summary Ordered steps with vertical arrows between selected items.
 * @scope Client ordering UI only; correctness remains server-side.
 */
import { ArrowDown } from 'lucide-react';
import { ChoiceButton } from './ChoiceButton';

type Props = {
  options: string[];
  value: string[];
  disabled?: boolean;
  onChange: (value: string[]) => void;
};

export function OrderStepsInteraction({ options, value, disabled, onChange }: Props) {
  const remaining = options.filter((option) => !value.includes(option));

  function add(option: string) {
    onChange([...value, option]);
  }

  function remove(option: string) {
    onChange(value.filter((item) => item !== option));
  }

  return (
    <div className="space-y-6">
      {/* Selected steps — ordered vertical flow */}
      {value.length > 0 ? (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={item}>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#58cc02] text-sm font-black text-white shadow-[0_3px_0_#3f8f01]">
                  {index + 1}
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => remove(item)}
                  className="flex-1 rounded-xl border-2 border-[#58cc02] bg-[#58cc02]/5 px-4 py-3 text-left text-sm font-bold text-[#1f1f1f] hover:bg-[#58cc02]/10 disabled:opacity-50"
                >
                  {item}
                </button>
              </div>
              {index < value.length - 1 ? (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-5 w-5 text-[#58cc02]" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-[#d0d0d0] bg-[#f5f5f5] px-6 py-8 text-center">
          <p className="text-sm font-bold text-[#afafaf]">
            Clica els passos en l&apos;ordre correcte
          </p>
        </div>
      )}

      {/* Remaining options to pick from */}
      {remaining.length > 0 ? (
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#afafaf]">
            Passos disponibles
          </p>
          <div className="grid gap-2">
            {remaining.map((option) => (
              <ChoiceButton key={option} active={false} disabled={disabled} onClick={() => add(option)}>
                {option}
              </ChoiceButton>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
