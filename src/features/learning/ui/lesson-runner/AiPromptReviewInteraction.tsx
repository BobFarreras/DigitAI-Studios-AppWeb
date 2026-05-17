/**
 * @file src/features/learning/ui/lesson-runner/AiPromptReviewInteraction.tsx
 * @updated 2026-05-17
 * @summary AI prompt review checklist interaction.
 * @scope Client checklist UI only; correctness remains server-side.
 */
import { MultiSelectInteraction } from './MultiSelectInteraction';
import type { FeedbackStatus } from './ChoiceButton';

type Props = {
  options: string[];
  value: string[];
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
  onChange: (value: string[]) => void;
};

export function AiPromptReviewInteraction(props: Props) {
  return <MultiSelectInteraction {...props} />;
}
