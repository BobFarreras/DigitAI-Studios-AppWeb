/**
 * @file src/features/learning/ui/lesson-runner/AdvancedStepInteraction.tsx
 * @updated 2026-05-17
 * @summary Routes advanced lesson interactions to their focused controls.
 * @scope Client UI routing only; correctness remains server-side.
 */
import type { LearningRunnerStep } from '@/services/learning/learning-lesson-service';
import { AiPromptReviewInteraction } from './AiPromptReviewInteraction';
import { CodeEditorInteraction } from './CodeEditorInteraction';
import { NetworkDiagramInteraction } from './NetworkDiagramInteraction';
import { SecurityTriageInteraction } from './SecurityTriageInteraction';
import { TerminalSimulationInteraction } from './TerminalSimulationInteraction';
import type { FeedbackStatus } from './ChoiceButton';

type Props = {
  step: LearningRunnerStep;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  feedbackStatus?: FeedbackStatus;
};

export function AdvancedStepInteraction({ step, value, onChange, disabled, feedbackStatus }: Props) {
  if (step.type === 'ai_prompt_review') {
    return <AiPromptReviewInteraction options={asStringArray(step.config.options)} value={asStringArray(value)} disabled={disabled} feedbackStatus={feedbackStatus} onChange={onChange} />;
  }
  if (step.type === 'terminal_simulation') {
    return <TerminalSimulationInteraction value={asString(value)} promptLabel={asOptionalString(step.config.promptLabel)} disabled={disabled} feedbackStatus={feedbackStatus} onChange={onChange} />;
  }
  if (step.type === 'code_editor') {
    return <CodeEditorInteraction value={asString(value)} language={asOptionalString(step.config.language)} disabled={disabled} feedbackStatus={feedbackStatus} onChange={onChange} />;
  }
  if (step.type === 'network_diagram') {
    return <NetworkDiagramInteraction options={asDiagramOptions(step.config.options)} value={asOptionalString(value)} disabled={disabled} feedbackStatus={feedbackStatus} onChange={onChange} />;
  }
  if (step.type === 'security_triage') {
    return <SecurityTriageInteraction options={asStringArray(step.config.options)} value={asOptionalString(value)} disabled={disabled} feedbackStatus={feedbackStatus} onChange={onChange} />;
  }
  return null;
}

export function isAdvancedStepType(type: string) {
  return ['ai_prompt_review', 'terminal_simulation', 'code_editor', 'network_diagram', 'security_triage'].includes(type);
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function asOptionalString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function asDiagramOptions(value: unknown): Array<{ label: string; description: string }> {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is { label: string; description: string } => typeof item?.label === 'string' && typeof item.description === 'string');
}
