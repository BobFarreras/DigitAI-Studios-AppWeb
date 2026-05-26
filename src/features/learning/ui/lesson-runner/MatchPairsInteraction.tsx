/**
 * @file src/features/learning/ui/lesson-runner/MatchPairsInteraction.tsx
 * @updated 2026-05-17
 * @summary Matching pairs lesson interaction.
 * @scope Client pair matching UI only; correctness remains server-side.
 */
import { ChoiceButton, type FeedbackStatus } from './ChoiceButton';

type PairOption = { left: string; right: string[] };

type Props = {
  pairs: PairOption[];
  value: Record<string, unknown>;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onChange: (value: Record<string, unknown>) => void;
};

export function MatchPairsInteraction({ pairs, value, disabled, feedbackStatus, onChange }: Props) {
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
