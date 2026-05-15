/**
 * @file src/features/tests/ui/CampaignAnalytics.tsx
 * @updated 2026-05-09
 * @summary Vista d'analítica agregada per campanyes de testing.
 * @scope Composició de KPI, incidències i progrés per testers.
 */
'use client';

import { CampaignKpiGrid } from './campaign-analytics/CampaignKpiGrid';
import { CampaignIssuesPanel } from './campaign-analytics/CampaignIssuesPanel';
import { CampaignTeamProgress } from './campaign-analytics/CampaignTeamProgress';
import { AnalyticsData } from './campaign-analytics/types';
import { buildGlobalStats, buildLeaderboard, getIssues } from './campaign-analytics/utils';

export function CampaignAnalytics({ data }: { data: AnalyticsData }) {
  const { results, totalTasks } = data;
  const { totalExecutions, failed, successRate } = buildGlobalStats(results);
  const leaderboard = buildLeaderboard(results);
  const issues = getIssues(results);

  return (
    <div className="space-y-8">
      <CampaignKpiGrid totalExecutions={totalExecutions} failed={failed} successRate={successRate} activeTesters={leaderboard.length} />
      <div className="grid lg:grid-cols-3 gap-8">
        <CampaignIssuesPanel issues={issues} />
        <CampaignTeamProgress leaderboard={leaderboard} totalTasks={totalTasks} />
      </div>
    </div>
  );
}
