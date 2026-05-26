/**
 * @file src/features/tests/ui/campaign-analytics/CampaignIssuesPanel.tsx
 * @updated 2026-05-09
 * @summary Panell d'incidències i feedback recents.
 * @scope Llistat visual d'errors, bloquejos i comentaris de testers.
 */

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, XCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { TestResult } from './types';

export function CampaignIssuesPanel({ issues }: { issues: TestResult[] }) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <h3 className="font-bold text-foreground flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-orange-500" />
        Feedback i Incidències Recents
      </h3>
      {issues.length === 0 ? (
        <div className="p-8 border border-dashed border-border rounded-xl text-center text-muted-foreground bg-muted/20">
          Tot net! No hi ha comentaris ni errors reportats.
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div key={issue.id} className="bg-card border border-border p-4 rounded-xl flex gap-4 items-start shadow-sm">
              <div className="mt-1 shrink-0">
                {issue.status === 'fail' && <XCircle className="w-5 h-5 text-red-500" />}
                {issue.status === 'blocked' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                {issue.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-foreground text-sm truncate pr-2">{issue.taskTitle}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(issue.updated_at).toLocaleDateString()}</span>
                </div>
                {issue.comment && <p className="text-sm text-foreground bg-muted p-3 rounded-lg mb-3 leading-relaxed">"{issue.comment}"</p>}
                <div className="flex items-center gap-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={issue.tester.avatar_url || ''} />
                    <AvatarFallback className="text-[9px]">{issue.tester.email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate">{issue.tester.full_name || issue.tester.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
