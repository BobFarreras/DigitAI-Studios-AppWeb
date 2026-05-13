/**
 * @file src/components/landing/v2/custom-software/AccessView.tsx
 * @updated 2026-05-13
 * @summary Vista de control d'accessos.
 * @scope Activar/desactivar usuaris interns.
 */
'use client';
import { motion } from 'framer-motion';
import type { Member } from './model';
import { useSoftwareText } from './software-i18n';

type Props = {
  team: Member[];
  userName: string;
  onSetUserName: (value: string) => void;
  onAddUser: () => void;
  onToggle: (id: string) => void;
};

export function AccessView({ team, userName, onSetUserName, onAddUser, onToggle }: Props) {
  const ui = useSoftwareText();
  return (
    <motion.div key="access" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={userName} onChange={(e) => onSetUserName(e.target.value)} placeholder={ui.t('newUser')} className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] dark:border-[#323334] dark:bg-[#08090a]" />
        <button onClick={onAddUser} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">{ui.t('createUser')}</button>
      </div>
      <div className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4] p-3 dark:border-[#23252a] dark:bg-[#161718]">
        <div className="space-y-2">
          {team.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-[6px] border border-[#c0c8d5] bg-white px-3 py-2 dark:border-[#323334] dark:bg-[#08090a]">
              <div><p className="text-[12px]">{u.name}</p><p className="text-[11px] text-[#62666d]">{u.role} · {u.zone}</p></div>
              <button onClick={() => onToggle(u.id)} className={`rounded-[5px] px-2 py-1 text-[11px] ${u.enabled ? 'bg-[#27a644]/20 text-[#27a644]' : 'bg-[#eb5757]/20 text-[#eb5757]'}`}>{u.enabled ? ui.t('active') : ui.t('blocked')}</button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
