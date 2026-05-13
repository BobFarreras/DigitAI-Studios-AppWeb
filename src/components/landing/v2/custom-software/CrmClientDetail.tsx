/**
 * @file src/components/landing/v2/custom-software/CrmClientDetail.tsx
 * @updated 2026-05-13
 * @summary Fitxa minimalista de client CRM.
 * @scope Detall comercial client-side i canvi de fase.
 */
'use client';
import { useState, type ReactNode } from 'react';
import { ArrowLeft, Building2, CalendarCheck, Check, Circle, Clock3, Euro, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Target, UserRound } from 'lucide-react';
import type { Client, LeadStage } from './model';

type Props = { client: Client; onBack: () => void; onSetStage: (stage: LeadStage) => void };
const stages: LeadStage[] = ['Nou', 'Qualificat', 'Proposta', 'Tancat'];

export function CrmClientDetail({ client, onBack, onSetStage }: Props) {
  const profile = getClientProfile(client);
  return (
    <div className="h-full overflow-auto rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]">
      <div className="flex min-h-12 items-center justify-between border-b border-[#d0d6e0] px-4 dark:border-[#23252a]">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-[12px] font-[560] text-[#62666d] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]"><ArrowLeft className="h-4 w-4" />Clients</button>
        <StageMenu value={client.stage} onChange={onSetStage} />
      </div>
      <section className="grid gap-4 border-b border-[#d0d6e0] px-4 py-4 dark:border-[#23252a] lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <p className="text-[12px] text-[#8a8f98]">{client.segment} · owner {client.owner}</p>
          <h4 className="mt-1 text-[24px] font-semibold leading-tight">{client.name}</h4>
          <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#62666d] dark:text-[#8a8f98]">{profile.summary}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <Info icon={<Phone className="h-4 w-4" />} label="Telèfon" value={profile.phone} />
          <Info icon={<Mail className="h-4 w-4" />} label="Email" value={profile.email} />
        </div>
      </section>
      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        <main className="border-b border-[#d0d6e0] p-4 dark:border-[#23252a] lg:border-b-0 lg:border-r">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Info icon={<UserRound className="h-4 w-4" />} label="Responsable" value={client.owner} />
            <Info icon={<Euro className="h-4 w-4" />} label="Valor estimat" value={profile.value} />
            <Info icon={<Target className="h-4 w-4" />} label="Probabilitat" value={profile.probability} />
            <Info icon={<Clock3 className="h-4 w-4" />} label="Proper contacte" value={profile.nextContact} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Block title="Abast comercial" text={profile.scope} />
            <Block title="Proper pas" text={profile.nextStep} />
          </div>
          <Section title="Historial">
            <div className="grid gap-2 md:grid-cols-2">
              {profile.history.map((item) => <p key={item} className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]">{item}</p>)}
            </div>
          </Section>
        </main>
        <aside className="space-y-4 p-4">
          <Section title="Origen i qualificació">
            <Info icon={<Globe2 className="h-4 w-4" />} label="Canal" value={profile.source} />
            <Info icon={<Building2 className="h-4 w-4" />} label="Decisor" value={profile.decisionMaker} />
            <Info icon={<MessageCircle className="h-4 w-4" />} label="Interès" value={profile.intent} />
            <Info icon={<CalendarCheck className="h-4 w-4" />} label="Tancament previst" value={profile.closeDate} />
            <Info icon={<MapPin className="h-4 w-4" />} label="Zona" value={profile.zone} />
            <Info icon={<FileText className="h-4 w-4" />} label="Pressupost" value={profile.budget} />
          </Section>
        </aside>
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><div className="mb-1 flex items-center gap-2 text-[#8a8f98]">{icon}{label}</div><p className="break-words font-[560]">{value}</p></div>; }
function Block({ title, text }: { title: string; text: string }) { return <section className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-3 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><h5 className="mb-1 text-[13px] font-semibold">{title}</h5><p className="leading-5 text-[#62666d] dark:text-[#8a8f98]">{text}</p></section>; }
function Section({ title, children }: { title: string; children: ReactNode }) { return <section><h5 className="mb-2 text-[13px] font-semibold">{title}</h5><div className="space-y-2">{children}</div></section>; }
function getClientProfile(client: Client) {
  const closed = client.stage === 'Tancat', proposal = client.stage === 'Proposta';
  const probability = closed ? '100%' : proposal ? '72%' : client.stage === 'Qualificat' ? '48%' : '18%';
  const value = client.segment.includes('Manteniment') ? '3.600 €/any' : client.segment.includes('Caldera') ? '1.850 €' : client.segment.includes('Cuina') ? '2.400 €' : '980 €';
  const phone = client.id % 2 === 0 ? '972 418 206' : '972 000 148';
  const zone = client.id % 2 === 0 ? 'Girona nord' : 'Girona centre';
  const email = `${client.name.toLowerCase().replaceAll(' ', '.')}@client.cat`;
  const sources = ['Instagram Ads', 'Facebook Lead', 'Web corporativa', 'Google Business', 'Referit client'];
  const source = sources[client.id % sources.length];
  const decisionMaker = client.segment.includes('comunitari') || client.segment.includes('mensual') ? 'Administrador finques' : client.segment.includes('Cuina') ? 'Cap de sala' : 'Gerència';
  const intent = proposal || closed ? 'Alta intenció' : client.stage === 'Qualificat' ? 'Validant abast' : 'Entrada nova';
  const closeDate = closed ? 'Tancat' : proposal ? 'Aquesta setmana' : '7-10 dies';
  const scope = client.segment.includes('Manteniment') ? 'Revisió preventiva de xarxa d aigua, incidències recurrents i proposta de quota mensual amb temps de resposta pactat.' : client.segment.includes('Caldera') ? 'Diagnosi de caldera, comprovació de pressió, recanvis compatibles i proposta de substitució si la reparació no compensa.' : client.segment.includes('Cuina') ? 'Intervenció en cuina professional amb prioritat operativa, franja fora de servei i materials crítics reservats.' : `Servei ${client.segment.toLowerCase()} amb visita tècnica, fotos, amidaments i pressupost detallat per partida.`;
  const nextStep = closed ? 'Programar revisió de qualitat, activar manteniment preventiu i detectar noves instal·lacions pendents.' : proposal ? 'Revisar objeccions del pressupost, confirmar materials i tancar data d execució amb el responsable.' : 'Qualificar urgència, agendar visita tècnica i deixar proposta preparada abans de 24 h.';
  return { summary: `${client.name} entra per ${source.toLowerCase()} amb una necessitat de ${client.segment.toLowerCase()}. El CRM deixa clar qui decideix, quin valor té l oportunitat i quin moviment toca fer per avançar sense perdre context.`, value, probability, nextContact: closed ? 'Revisió · 30 dies' : 'Avui · 16:30', phone, email, zone, source, decisionMaker, intent, closeDate, budget: closed ? 'Acceptat' : proposal ? 'En negociació' : 'Pendent', scope, nextStep, history: ['Lead capturat i enriquit amb dades de contacte', 'Trucada qualificada amb necessitat i franja horària', 'Visita tècnica amb fotos i materials previstos', proposal ? 'Pressupost enviat amb 3 partides' : 'Tasques comercials obertes al pipeline'] };
}
function StageIcon({ stage }: { stage: LeadStage }) { const c = stage === 'Nou' ? 'text-[#6b7cff]' : stage === 'Qualificat' ? 'text-[#00c2d7]' : stage === 'Proposta' ? 'text-[#facc15]' : 'text-[#22c55e]'; const icon = stage === 'Tancat' ? <Check className="h-4 w-4" /> : stage === 'Proposta' ? <FileText className="h-4 w-4" /> : stage === 'Qualificat' ? <Target className="h-4 w-4" /> : <Circle className="h-4 w-4" />; return <span className={c}>{icon}</span>; }
function StageMenu({ value, onChange }: { value: LeadStage; onChange: (stage: LeadStage) => void }) { const [open, setOpen] = useState(false); return <div className="relative"><button onClick={() => setOpen((v) => !v)} className="flex h-8 items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><span className="text-[#8a8f98]">Fase</span><StageIcon stage={value} /><span className="font-semibold">{value}</span></button>{open ? <div className="absolute right-0 top-10 z-40 w-40 rounded-[7px] border border-[#c0c8d5] bg-white p-1 shadow-[0_16px_42px_rgba(8,9,10,0.16)] dark:border-[#323334] dark:bg-[#08090a]">{stages.map((s) => <button key={s} onClick={() => { onChange(s); setOpen(false); }} className={`flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[12px] ${value === s ? 'bg-[#eceff4] dark:bg-[#161718]' : 'text-[#62666d] hover:bg-[#f4f6fa] dark:text-[#8a8f98] dark:hover:bg-[#161718]'}`}><StageIcon stage={s} />{s}</button>)}</div> : null}</div>; }
