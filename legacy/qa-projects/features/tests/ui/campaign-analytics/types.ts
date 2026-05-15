/**
 * @file src/features/tests/ui/campaign-analytics/types.ts
 * @updated 2026-05-09
 * @summary Tipus de dades per analítica de campanyes QA.
 * @scope Contractes compartits entre panells de KPI, incidències i progrés.
 */

export type TestResult = {
  id: string;
  status: 'pass' | 'fail' | 'blocked';
  comment?: string | null;
  updated_at: string;
  taskTitle: string;
  user_id: string;
  tester: {
    id?: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
};

export type AnalyticsData = {
  results: TestResult[];
  totalTasks: number;
};

export type UserStat = {
  user: TestResult['tester'];
  completed: number;
  passed: number;
  failed: number;
};
