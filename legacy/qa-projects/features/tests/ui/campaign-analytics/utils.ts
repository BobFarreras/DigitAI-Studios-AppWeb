/**
 * @file src/features/tests/ui/campaign-analytics/utils.ts
 * @updated 2026-05-09
 * @summary Càlculs d'analítica per campanyes de testing.
 * @scope Agregacions pures per KPI global i leaderboard.
 */

import { TestResult, UserStat } from './types';

export function buildGlobalStats(results: TestResult[]) {
  const totalExecutions = results.length;
  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const successRate = totalExecutions > 0 ? Math.round((passed / totalExecutions) * 100) : 0;
  return { totalExecutions, passed, failed, successRate };
}

export function buildLeaderboard(results: TestResult[]) {
  const userStats = new Map<string, UserStat>();
  results.forEach((result) => {
    if (!userStats.has(result.user_id)) {
      userStats.set(result.user_id, { user: result.tester, completed: 0, passed: 0, failed: 0 });
    }
    const stats = userStats.get(result.user_id)!;
    stats.completed++;
    if (result.status === 'pass') stats.passed++;
    if (result.status === 'fail') stats.failed++;
  });
  return [...userStats.values()];
}

export function getIssues(results: TestResult[]) {
  return results.filter((result) => result.status === 'fail' || result.status === 'blocked' || result.comment);
}
