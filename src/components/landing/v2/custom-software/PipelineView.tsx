/**
 * @file src/components/landing/v2/custom-software/PipelineView.tsx
 * @updated 2026-05-13
 * @summary Vista pipeline SAT.
 * @scope Gestio d'ordres i canvi d'estat.
 */
'use client';
import { motion } from 'framer-motion';
import type { Job, JobState } from './model';

type Props = {
  jobs: Job[];
  jobTitle: string;
  onSetJobTitle: (value: string) => void;
  onAddJob: () => void;
  onAdvance: (id: string) => void;
};

const states: JobState[] = ['Pendent', 'En curs', 'Blocat', 'Completat'];

export function PipelineView({ jobs, jobTitle, onSetJobTitle, onAddJob, onAdvance }: Props) {
  return (
    <motion.div key="pipeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={jobTitle} onChange={(e) => onSetJobTitle(e.target.value)} placeholder="Nova tasca SAT" className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] dark:border-[#323334] dark:bg-[#08090a]" />
        <button onClick={onAddJob} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">Afegir tasca</button>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {states.map((state) => (
          <div key={state} className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4] p-3 dark:border-[#23252a] dark:bg-[#161718]">
            <div className="mb-2 flex items-center justify-between"><p className="text-[12px]">{state}</p><span className="text-[11px] text-[#8a8f98]">{jobs.filter((j) => j.state === state).length}</span></div>
            <div className="space-y-2">
              {jobs.filter((j) => j.state === state).map((j) => (
                <button key={j.id} onClick={() => onAdvance(j.id)} className="w-full rounded-[6px] border border-[#c0c8d5] bg-white p-2 text-left dark:border-[#323334] dark:bg-[#08090a]">
                  <p className="text-[12px]">{j.title}</p><p className="text-[11px] text-[#62666d]">{j.id} · {j.client}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
