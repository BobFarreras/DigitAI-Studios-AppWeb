/**
 * @file tests/integration/learning-lesson-flow.test.tsx
 * @updated 2026-05-17
 * @summary Integration tests for the complete learning lesson service flow.
 * @scope Verifies runner loading, answer sanitization, grading and persistence contract.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import type {
  ILearningRepository,
  LearningAttemptCompletion,
  LearningDashboardSnapshot,
  LearningLessonDetailRecord,
} from '@/repositories/interfaces/ILearningRepository';
import { LearningLessonService } from '@/services/learning/learning-lesson-service';
import { LearningLessonRunner } from '@/features/learning/ui/LearningLessonRunner';
import { checkLearningStepAnswer, submitLearningLesson } from '@/actions/learning-lesson';

vi.mock('@/routing', () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href?.toString()} {...props}>{children}</a>
  ),
}));

vi.mock('@/actions/learning-lesson', () => ({
  checkLearningStepAnswer: vi.fn(),
  submitLearningLesson: vi.fn(),
}));

class MemoryLearningRepository implements ILearningRepository {
  public completedAttempt: LearningAttemptCompletion | null = null;

  constructor(private detail: LearningLessonDetailRecord) {}

  async getDashboardSnapshot(): Promise<LearningDashboardSnapshot> {
    throw new Error('not used');
  }

  async getLessonDetail() {
    return this.detail;
  }

  async getWeakSpots() {
    return [];
  }

  async completeAttempt(input: LearningAttemptCompletion) {
    this.completedAttempt = input;
  }
}

const lessonDetail: LearningLessonDetailRecord = {
  trackSlug: 'iniciacio-digital',
  trackTitle: 'Iniciacio Digital',
  moduleTitle: 'Fonaments digitals',
  lesson: {
    id: 'lesson-1',
    slug: 'que-es-un-sistema-operatiu',
    title: 'Que es un sistema operatiu',
    objective: 'Entendre capes basiques',
    estimatedMinutes: 5,
    xpReward: 10,
    orderIndex: 1,
  },
  steps: [
    {
      id: 'step-choice',
      lessonId: 'lesson-1',
      type: 'multiple_choice',
      prompt: 'Que coordina?',
      explanation: null,
      config: { options: ['Hardware', 'Cafetera'], correctAnswer: 'Hardware' },
      orderIndex: 1,
    },
    {
      id: 'step-order',
      lessonId: 'lesson-1',
      type: 'order_steps',
      prompt: 'Ordena capes',
      explanation: null,
      config: { options: ['Hardware', 'SO'], correctAnswer: ['Hardware', 'SO'] },
      orderIndex: 2,
    },
    {
      id: 'step-match',
      lessonId: 'lesson-1',
      type: 'match_pairs',
      prompt: 'Relaciona',
      explanation: null,
      config: {
        options: [{ left: 'SO', right: ['Coordinar recursos', 'Cable'] }],
        correctAnswer: { SO: 'Coordinar recursos' },
      },
      orderIndex: 3,
    },
  ],
};

const advancedSteps: LearningLessonDetailRecord['steps'] = [
  {
    id: 'step-multi',
    lessonId: 'lesson-1',
    type: 'multi_select',
    prompt: 'Quins controls redueixen risc?',
    explanation: 'Combinar contrasenya unica i 2FA redueix reutilitzacio i robatori.',
    config: { options: ['2FA', 'Contrasenya unica', 'Compartir codis'], correctAnswer: ['2FA', 'Contrasenya unica'] },
    orderIndex: 4,
  },
  {
    id: 'step-blank',
    lessonId: 'lesson-1',
    type: 'fill_blank',
    prompt: 'Quin component filtra transit?',
    explanation: 'Un firewall aplica regles de filtratge sobre connexions.',
    config: { placeholder: 'Nom del component', correctAnswer: 'firewall' },
    orderIndex: 5,
  },
  {
    id: 'step-code',
    lessonId: 'lesson-1',
    type: 'code_choice',
    prompt: 'Quin snippet valida millor?',
    explanation: 'Validar entrada abans de guardar evita estats invalids.',
    config: {
      options: [
        { label: 'Snippet segur', code: 'const parsed = schema.parse(input)' },
        { label: 'Snippet feble', code: 'save(input)' },
      ],
      correctAnswer: 'Snippet segur',
    },
    orderIndex: 6,
  },
];

const expertSteps: LearningLessonDetailRecord['steps'] = [
  {
    id: 'step-terminal',
    lessonId: 'lesson-1',
    type: 'terminal_simulation',
    prompt: 'Quina comanda consulta DNS?',
    explanation: 'nslookup consulta resolucio DNS per un domini.',
    config: { promptLabel: 'dns lab', correctAnswer: 'nslookup digitai.studio' },
    orderIndex: 7,
  },
  {
    id: 'step-network',
    lessonId: 'lesson-1',
    type: 'network_diagram',
    prompt: 'Quin node resol dominis?',
    explanation: 'DNS tradueix dominis a adreces IP.',
    config: {
      options: [
        { label: 'Router', description: 'Encamina paquets entre xarxes' },
        { label: 'DNS', description: 'Resol noms de domini' },
      ],
      correctAnswer: 'DNS',
    },
    orderIndex: 8,
  },
  {
    id: 'step-editor',
    lessonId: 'lesson-1',
    type: 'code_editor',
    prompt: 'Escriu una validacio minima',
    explanation: 'La validacio converteix input extern en dades fiables.',
    config: { language: 'ts', correctAnswer: 'const safe = schema.parse(input);' },
    orderIndex: 9,
  },
  {
    id: 'step-ai',
    lessonId: 'lesson-1',
    type: 'ai_prompt_review',
    prompt: 'Que falta al prompt?',
    explanation: 'Un bon prompt defineix objectiu i format de sortida.',
    config: { options: ['Objectiu concret', 'Format de sortida', 'Mes emojis'], correctAnswer: ['Objectiu concret', 'Format de sortida'] },
    orderIndex: 10,
  },
  {
    id: 'step-triage',
    lessonId: 'lesson-1',
    type: 'security_triage',
    prompt: 'SSRF intern amb metadata cloud',
    explanation: 'Accedir a metadata cloud pot exposar credencials temporals.',
    config: { options: ['Baixa', 'Mitjana', 'Alta', 'Critica'], correctAnswer: 'Alta' },
    orderIndex: 11,
  },
];

describe('LearningLessonService integration flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads a runner without leaking correct answers', async () => {
    const service = new LearningLessonService(new MemoryLearningRepository(lessonDetail));
    const runner = await service.getRunner('iniciacio-digital', 'que-es-un-sistema-operatiu');

    expect(runner?.steps).toHaveLength(3);
    expect(runner?.steps[0].config.options).toEqual(['Hardware', 'Cafetera']);
    expect(runner?.steps.some((step) => 'correctAnswer' in step.config)).toBe(false);
  });

  it('grades mixed interactions and persists the completed attempt', async () => {
    const repository = new MemoryLearningRepository(lessonDetail);
    const service = new LearningLessonService(repository);

    const result = await service.submitLesson('user-1', 'iniciacio-digital', 'que-es-un-sistema-operatiu', [
      { stepId: 'step-choice', value: 'Hardware', hintUsed: false, timeSpentSeconds: 3 },
      { stepId: 'step-order', value: ['Hardware', 'SO'], hintUsed: false, timeSpentSeconds: 8 },
      { stepId: 'step-match', value: { SO: 'Coordinar recursos' }, hintUsed: false, timeSpentSeconds: 7 },
    ]);

    expect(result.score).toBe(100);
    expect(repository.completedAttempt?.status).toBe('completed');
    expect(repository.completedAttempt?.answers.every((answer) => answer.isCorrect)).toBe(true);
    expect(repository.completedAttempt?.xpAwarded).toBe(10);
  });

  it('persists incorrect answers and marks a weak attempt for review', async () => {
    const repository = new MemoryLearningRepository(lessonDetail);
    const service = new LearningLessonService(repository);

    const result = await service.submitLesson('user-1', 'iniciacio-digital', 'que-es-un-sistema-operatiu', [
      { stepId: 'step-choice', value: 'Cafetera', hintUsed: false, timeSpentSeconds: 3 },
      { stepId: 'step-order', value: ['SO', 'Hardware'], hintUsed: false, timeSpentSeconds: 8 },
      { stepId: 'step-match', value: { SO: 'Cable' }, hintUsed: false, timeSpentSeconds: 7 },
    ]);

    expect(result.requiresReview).toBe(true);
    expect(repository.completedAttempt?.status).toBe('needs_review');
    expect(repository.completedAttempt?.answers.every((answer) => !answer.isCorrect)).toBe(true);
  });

  it('does not crash when a lesson has no published steps', () => {
    render(<LearningLessonRunner data={{ ...lessonDetail, lesson: lessonDetail.lesson, steps: [] }} />);

    expect(screen.getByText('Llico en preparacio')).toBeInTheDocument();
  });

  it('shows server feedback when a selected answer is wrong', async () => {
    vi.mocked(checkLearningStepAnswer).mockResolvedValue({
      success: true,
      data: {
        stepId: 'step-choice',
        isCorrect: false,
        explanation: 'El sistema operatiu coordina recursos.',
      },
    });

    render(<LearningLessonRunner data={lessonDetail} />);

    await userEvent.click(screen.getByRole('button', { name: /Cafetera/i }));
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));

    expect(await screen.findByText('Incorrecte')).toBeInTheDocument();
    expect(screen.getByText('El sistema operatiu coordina recursos.')).toBeInTheDocument();
    expect(checkLearningStepAnswer).toHaveBeenCalledWith(expect.objectContaining({ value: 'Cafetera' }));
  });

  it('uses blue for selected answers, then completes with timed answers', async () => {
    vi.mocked(checkLearningStepAnswer).mockResolvedValue({
      success: true,
      data: { stepId: 'step-choice', isCorrect: true, explanation: 'Resposta validada.' },
    });
    vi.mocked(submitLearningLesson).mockResolvedValue({
      success: true,
      data: {
        score: 100,
        correctCount: 1,
        mistakeCount: 0,
        accuracy: 100,
        requiresReview: false,
        xpAwarded: 10,
        timeSpentSeconds: 1,
        answers: [],
      },
    });

    render(<LearningLessonRunner data={{ ...lessonDetail, steps: [lessonDetail.steps[0]] }} />);

    const choice = screen.getByRole('button', { name: /Hardware/i });
    await userEvent.click(choice);
    expect(choice.className).toContain('border-[#1cb0f6]');

    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));
    expect(await screen.findByText('Correcte')).toBeInTheDocument();
    expect(choice.className).toContain('border-[#58cc02]');

    await userEvent.click(screen.getByRole('button', { name: /Completar/i }));
    expect(await screen.findByText('Llico completada')).toBeInTheDocument();

    const submitted = vi.mocked(submitLearningLesson).mock.calls[0][0] as { answers: Array<{ timeSpentSeconds: number }> };
    expect(submitted.answers[0].timeSpentSeconds).toBeGreaterThan(0);
  });

  it('shows a visible error when answer checking fails', async () => {
    vi.mocked(checkLearningStepAnswer).mockResolvedValue({ success: false, error: 'server_error' });

    render(<LearningLessonRunner data={{ ...lessonDetail, steps: [lessonDetail.steps[0]] }} />);

    await userEvent.click(screen.getByRole('button', { name: /Hardware/i }));
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));

    expect(await screen.findByText('No hem pogut comprovar la resposta. Torna-ho a provar.')).toBeInTheDocument();
  });

  it('supports multi-select, fill blank and code choice interactions', async () => {
    vi.mocked(checkLearningStepAnswer).mockResolvedValue({
      success: true,
      data: { stepId: 'step-multi', isCorrect: true, explanation: 'Validat.' },
    });

    render(<LearningLessonRunner data={{ ...lessonDetail, steps: advancedSteps }} />);

    await userEvent.click(screen.getByRole('button', { name: /2FA/i }));
    await userEvent.click(screen.getByRole('button', { name: /Contrasenya unica/i }));
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));
    expect(await screen.findByText('Correcte')).toBeInTheDocument();
    expect(checkLearningStepAnswer).toHaveBeenCalledWith(expect.objectContaining({ value: ['2FA', 'Contrasenya unica'] }));

    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }));
    await userEvent.type(screen.getByRole('textbox'), 'firewall');
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));
    expect(checkLearningStepAnswer).toHaveBeenCalledWith(expect.objectContaining({ value: 'firewall' }));

    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }));
    await userEvent.click(screen.getByRole('button', { name: /Snippet segur/i }));
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));
    expect(checkLearningStepAnswer).toHaveBeenCalledWith(expect.objectContaining({ value: 'Snippet segur' }));
  });

  it('supports terminal, network, code editor, prompt review and triage interactions', async () => {
    vi.mocked(checkLearningStepAnswer).mockResolvedValue({
      success: true,
      data: { stepId: 'step-terminal', isCorrect: true, explanation: 'Validat.' },
    });

    render(<LearningLessonRunner data={{ ...lessonDetail, steps: expertSteps }} />);

    await userEvent.type(screen.getByPlaceholderText('escriu una comanda'), 'nslookup digitai.studio');
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));
    expect(await screen.findByText('Correcte')).toBeInTheDocument();
    expect(checkLearningStepAnswer).toHaveBeenCalledWith(expect.objectContaining({ value: 'nslookup digitai.studio' }));

    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }));
    await userEvent.click(screen.getByRole('button', { name: /DNS/i }));
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));
    expect(checkLearningStepAnswer).toHaveBeenCalledWith(expect.objectContaining({ value: 'DNS' }));

    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }));
    await userEvent.type(screen.getByPlaceholderText('escriu el snippet'), 'const safe = schema.parse(input);');
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));
    expect(checkLearningStepAnswer).toHaveBeenCalledWith(expect.objectContaining({ value: 'const safe = schema.parse(input);' }));

    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }));
    await userEvent.click(screen.getByRole('button', { name: /Objectiu concret/i }));
    await userEvent.click(screen.getByRole('button', { name: /Format de sortida/i }));
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));
    expect(checkLearningStepAnswer).toHaveBeenCalledWith(expect.objectContaining({ value: ['Objectiu concret', 'Format de sortida'] }));

    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }));
    await userEvent.click(screen.getByRole('button', { name: /Alta/i }));
    await userEvent.click(screen.getByRole('button', { name: /Comprovar/i }));
    expect(checkLearningStepAnswer).toHaveBeenCalledWith(expect.objectContaining({ value: 'Alta' }));
  });
});
