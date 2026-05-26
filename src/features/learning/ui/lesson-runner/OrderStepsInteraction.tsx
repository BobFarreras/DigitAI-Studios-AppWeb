/**
 * @file src/features/learning/ui/lesson-runner/OrderStepsInteraction.tsx
 * @updated 2026-05-23
 * @summary Ordered steps with vertical arrows. Blue selected, green/red after feedback.
 * @scope Client ordering UI only; correctness remains server-side.
 */
import { ArrowDown } from 'lucide-react';
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
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-[0_3px_0_#00000020] ${
                  feedbackStatus === 'correct' ? 'bg-[#58cc02] shadow-[0_3px_0_#3f8f01]' :
                  feedbackStatus === 'incorrect' ? 'bg-[#ff4b4b] shadow-[0_3px_0_#c03030]' :
                  'bg-[#1cb0f6] shadow-[0_3px_0_#0a8cd6]'
                }`}>
                  {index + 1}
                </span>
                <ChoiceButton
                  key={item}
                  active={!feedbackStatus}
                  disabled={disabled}
                  feedbackStatus={feedbackStatus}
                  onClick={() => remove(item)}
                >
                  {item}
                </ChoiceButton>
              </div>
              {index < value.length - 1 ? (
                <div className="flex justify-center py-1">
                  <ArrowDown className={`h-5 w-5 ${
                    feedbackStatus === 'correct' ? 'text-[#58cc02]' :
                    feedbackStatus === 'incorrect' ? 'text-[#ff4b4b]' :
                    'text-[#1cb0f6]'
                  }`} />
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
      {remaining.length > 0 && !disabled ? (
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
