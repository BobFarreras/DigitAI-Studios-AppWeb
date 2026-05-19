/**
 * @file src/services/learning/admin-learning-content-validation.ts
 * @updated 2026-05-19
 * @summary Validates editable learning step config by interaction type.
 * @scope Pure admin content validation only.
 */
import type { LearningStepType } from '@/repositories/interfaces/ILearningRepository';

const TYPES_WITH_STRING_OPTIONS = new Set<LearningStepType>([
  'multiple_choice',
  'multi_select',
  'true_false',
  'scenario',
  'ai_prompt_review',
  'security_triage',
]);

export function assertValidStepConfig(type: LearningStepType, config: Record<string, unknown>) {
  if (!('correctAnswer' in config)) throw new Error('missing_correct_answer');
  if (TYPES_WITH_STRING_OPTIONS.has(type)) assertStringOptions(config);
  if (type === 'code_choice') assertCodeOptions(config);
  if (type === 'order_steps') assertStringArray(config.correctAnswer);
  if (type === 'match_pairs') assertRecord(config.correctAnswer);
  if (type === 'network_diagram') assertDiagramOptions(config);
}

function assertStringOptions(config: Record<string, unknown>) {
  const options = config.options;
  if (!Array.isArray(options) || !options.every((item) => typeof item === 'string')) {
    throw new Error('invalid_options');
  }
}

function assertCodeOptions(config: Record<string, unknown>) {
  const options = config.options;
  if (!Array.isArray(options) || !options.every(isCodeOption)) throw new Error('invalid_code_options');
}

function assertDiagramOptions(config: Record<string, unknown>) {
  const options = config.options;
  if (!Array.isArray(options) || !options.every(isDiagramOption)) throw new Error('invalid_diagram_options');
}

function assertStringArray(value: unknown) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error('invalid_correct_answer');
  }
}

function assertRecord(value: unknown) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('invalid_correct_answer');
  }
}

function isCodeOption(value: unknown): value is { label: string; code: string } {
  return typeof value === 'object'
    && value !== null
    && 'label' in value
    && 'code' in value
    && typeof value.label === 'string'
    && typeof value.code === 'string';
}

function isDiagramOption(value: unknown): value is { label: string; description: string } {
  return typeof value === 'object'
    && value !== null
    && 'label' in value
    && 'description' in value
    && typeof value.label === 'string'
    && typeof value.description === 'string';
}
