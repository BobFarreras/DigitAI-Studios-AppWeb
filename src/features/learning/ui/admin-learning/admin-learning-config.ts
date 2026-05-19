/**
 * @file src/features/learning/ui/admin-learning/admin-learning-config.ts
 * @updated 2026-05-19
 * @summary Converts step config between JSON and admin form fields.
 * @scope Client-side config editing helpers only.
 */
export type StepConfigForm = {
  optionsText: string;
  correctText: string;
  jsonText: string;
};

export function configToForm(config: Record<string, unknown>): StepConfigForm {
  return {
    optionsText: stringifyEditable(config.options),
    correctText: stringifyEditable(config.correctAnswer),
    jsonText: JSON.stringify(config, null, 2),
  };
}

export function formToConfig(form: StepConfigForm): Record<string, unknown> {
  const parsed = parseJsonObject(form.jsonText);
  const options = parseEditable(form.optionsText);
  const correctAnswer = parseEditable(form.correctText);
  return {
    ...parsed,
    ...(form.optionsText.trim() ? { options } : {}),
    correctAnswer,
  };
}

export function stringifyEditable(value: unknown) {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) return value.join('\n');
  if (typeof value === 'string') return value;
  if (value === undefined || value === null) return '';
  return JSON.stringify(value, null, 2);
}

export function parseEditable(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return JSON.parse(trimmed) as unknown;
  const lines = trimmed.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.length > 1 ? lines : trimmed;
}

function parseJsonObject(value: string): Record<string, unknown> {
  const parsed = JSON.parse(value) as unknown;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('invalid_json');
  }
  return parsed as Record<string, unknown>;
}
