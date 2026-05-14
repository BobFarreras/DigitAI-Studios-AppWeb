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
import { useSoftwareText } from './software-i18n';

type Props = { client: Client; onBack: () => void; onSetStage: (stage: LeadStage) => void };
const stages: LeadStage[] = ['Nou', 'Qualificat', 'Proposta', 'Tancat'];

export function CrmClientDetail({ client, onBack, onSetStage }: Props) {
  const ui = useSoftwareText();
  const profile = getClientProfile(client, ui.locale);
  return (
    <div className="h-full overflow-auto rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]">
      <div className="flex min-h-12 items-center justify-between border-b border-[#d0d6e0] px-4 dark:border-[#23252a]">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-[12px] font-[560] text-[#62666d] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]"><ArrowLeft className="h-4 w-4" />{ui.t('clients')}</button>
        <StageMenu value={client.stage} onChange={onSetStage} />
      </div>
      <section className="grid gap-4 border-b border-[#d0d6e0] px-4 py-4 dark:border-[#23252a] lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <p className="text-[12px] text-[#8a8f98]">{client.segment} · {ui.t('owner')} {client.owner}</p>
          <h4 className="mt-1 text-[24px] font-semibold leading-tight">{client.name}</h4>
          <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#62666d] dark:text-[#8a8f98]">{profile.summary}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <Info icon={<Phone className="h-4 w-4" />} tone="text-[#22c55e]" label={ui.t('phone')} value={profile.phone} />
          <Info icon={<Mail className="h-4 w-4" />} tone="text-[#35b8e8]" label={ui.t('email')} value={profile.email} />
        </div>
      </section>
      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        <main className="border-b border-[#d0d6e0] p-4 dark:border-[#23252a] lg:border-b-0 lg:border-r">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Info icon={<UserRound className="h-4 w-4" />} tone="text-[#8b5cf6]" label={ui.t('owner')} value={client.owner} />
            <Info icon={<Euro className="h-4 w-4" />} tone="text-[#22c55e]" label={ui.t('estimatedValue')} value={profile.value} />
            <Info icon={<Target className="h-4 w-4" />} tone="text-[#f59e0b]" label={ui.t('probability')} value={profile.probability} />
            <Info icon={<Clock3 className="h-4 w-4" />} tone="text-[#35b8e8]" label={ui.t('nextContact')} value={profile.nextContact} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Block title={ui.t('businessScope')} text={profile.scope} />
            <Block title={ui.t('nextStep')} text={profile.nextStep} />
          </div>
          <Section title={ui.t('history')}>
            <div className="grid gap-2 md:grid-cols-2">
              {profile.history.map((item) => <p key={item} className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]">{item}</p>)}
            </div>
          </Section>
        </main>
        <aside className="space-y-4 p-4">
          <Section title={ui.t('sourceQualification')}>
            <Info icon={<Globe2 className="h-4 w-4" />} tone="text-[#6366f1]" label={ui.t('leadSource')} value={profile.source} />
            <Info icon={<Building2 className="h-4 w-4" />} tone="text-[#8b5cf6]" label={ui.t('decisionMaker')} value={profile.decisionMaker} />
            <Info icon={<MessageCircle className="h-4 w-4" />} tone="text-[#35b8e8]" label={ui.t('interest')} value={profile.intent} />
            <Info icon={<CalendarCheck className="h-4 w-4" />} tone="text-[#22c55e]" label={ui.t('closeForecast')} value={profile.closeDate} />
            <Info icon={<MapPin className="h-4 w-4" />} tone="text-[#f59e0b]" label={ui.t('location')} value={profile.zone} />
            <Info icon={<FileText className="h-4 w-4" />} tone="text-[#e4f222] dark:text-[#e4f222]" label={ui.t('quote')} value={profile.budget} />
          </Section>
        </aside>
      </div>
    </div>
  );
}

function Info({ icon, label, value, tone = 'text-[#8a8f98]' }: { icon: ReactNode; label: string; value: string; tone?: string }) { return <div className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><div className="mb-1 flex items-center gap-2 text-[#8a8f98]"><span className={tone}>{icon}</span>{label}</div><p className="break-words font-[560]">{value}</p></div>; }
function Block({ title, text }: { title: string; text: string }) { return <section className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-3 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><h5 className="mb-1 text-[13px] font-semibold">{title}</h5><p className="leading-5 text-[#62666d] dark:text-[#8a8f98]">{text}</p></section>; }
function Section({ title, children }: { title: string; children: ReactNode }) { return <section><h5 className="mb-2 text-[13px] font-semibold">{title}</h5><div className="space-y-2">{children}</div></section>; }
function getClientProfile(client: Client, locale: string) {
  const closed = client.stage === 'Tancat', proposal = client.stage === 'Proposta';
  const probability = closed ? '100%' : proposal ? '72%' : client.stage === 'Qualificat' ? '48%' : '18%';
  const value = client.segment.includes('Manteniment') ? '3.600 €/any' : client.segment.includes('Caldera') ? '1.850 €' : client.segment.includes('Cuina') ? '2.400 €' : '980 €';
  const phone = client.id % 2 === 0 ? '972 418 206' : '972 000 148';
  const zone = client.id % 2 === 0 ? 'Girona nord' : 'Girona centre';
  const email = `${client.name.toLowerCase().replaceAll(' ', '.')}@client.cat`;
  const sources = ['Instagram Ads', 'Facebook Lead', 'Web corporativa', 'Google Business', 'Referit client'];
  const source = sources[client.id % sources.length];
  const decisionMaker = client.segment.includes('comunitari') || client.segment.includes('mensual') ? tr(locale, 'Administrador finques', 'Administrador fincas', 'Property manager', 'Amministratore') : client.segment.includes('Cuina') ? tr(locale, 'Cap de sala', 'Jefe de sala', 'Floor manager', 'Responsabile sala') : tr(locale, 'Gerència', 'Gerencia', 'Management', 'Direzione');
  const intent = proposal || closed ? tr(locale, 'Alta intenció', 'Alta intención', 'High intent', 'Alta intenzione') : client.stage === 'Qualificat' ? tr(locale, 'Validant abast', 'Validando alcance', 'Validating scope', 'Validazione ambito') : tr(locale, 'Entrada nova', 'Entrada nueva', 'New lead', 'Nuovo lead');
  const closeDate = closed ? tr(locale, 'Tancat', 'Cerrado', 'Closed', 'Chiuso') : proposal ? tr(locale, 'Aquesta setmana', 'Esta semana', 'This week', 'Questa settimana') : tr(locale, '7-10 dies', '7-10 días', '7-10 days', '7-10 giorni');
  const scope = tr(locale, `Servei ${client.segment.toLowerCase()} amb visita tècnica, fotos, amidaments i pressupost detallat per partida.`, `Servicio ${client.segment.toLowerCase()} con visita técnica, fotos, mediciones y presupuesto por partida.`, `${client.segment} service with site visit, photos, measurements and itemized quote.`, `Servizio ${client.segment.toLowerCase()} con sopralluogo, foto, misure e preventivo dettagliato.`);
  const nextStep = closed ? tr(locale, 'Programar revisió de qualitat, activar manteniment preventiu i detectar noves instal·lacions pendents.', 'Programar revisión de calidad, activar mantenimiento preventivo y detectar nuevas instalaciones pendientes.', 'Schedule quality review, activate preventive maintenance and detect pending installations.', 'Pianificare controllo qualità, attivare manutenzione preventiva e rilevare nuovi impianti.') : proposal ? tr(locale, 'Revisar objeccions del pressupost, confirmar materials i tancar data d execució.', 'Revisar objeciones del presupuesto, confirmar materiales y cerrar fecha de ejecución.', 'Review quote objections, confirm materials and lock execution date.', 'Rivedere obiezioni, confermare materiali e fissare la data.') : tr(locale, 'Qualificar urgència, agendar visita tècnica i deixar proposta preparada abans de 24 h.', 'Calificar urgencia, agendar visita técnica y preparar propuesta antes de 24 h.', 'Qualify urgency, schedule site visit and prepare the proposal within 24 h.', 'Qualificare urgenza, fissare sopralluogo e preparare proposta entro 24 h.');
  return { summary: tr(locale, `${client.name} entra per ${source.toLowerCase()} amb una necessitat de ${client.segment.toLowerCase()}. El CRM mostra decisor, valor i proper moviment.`, `${client.name} entra por ${source.toLowerCase()} con una necesidad de ${client.segment.toLowerCase()}. El CRM muestra decisor, valor y siguiente movimiento.`, `${client.name} came from ${source.toLowerCase()} with a ${client.segment.toLowerCase()} need. The CRM shows decision maker, value and next move.`, `${client.name} arriva da ${source.toLowerCase()} con esigenza ${client.segment.toLowerCase()}. Il CRM mostra decisore, valore e prossima azione.`), value, probability, nextContact: closed ? tr(locale, 'Revisió · 30 dies', 'Revisión · 30 días', 'Review · 30 days', 'Revisione · 30 giorni') : tr(locale, 'Avui · 16:30', 'Hoy · 16:30', 'Today · 16:30', 'Oggi · 16:30'), phone, email, zone, source, decisionMaker, intent, closeDate, budget: closed ? tr(locale, 'Acceptat', 'Aceptado', 'Accepted', 'Accettato') : proposal ? tr(locale, 'En negociació', 'En negociación', 'In negotiation', 'In negoziazione') : tr(locale, 'Pendent', 'Pendiente', 'Pending', 'In attesa'), scope, nextStep, history: [tr(locale, 'Lead capturat i enriquit amb dades de contacte', 'Lead capturado y enriquecido con datos de contacto', 'Lead captured and enriched with contact data', 'Lead acquisito e arricchito con dati contatto'), tr(locale, 'Trucada qualificada amb necessitat i franja horària', 'Llamada cualificada con necesidad y franja horaria', 'Qualified call with need and time slot', 'Chiamata qualificata con esigenza e fascia oraria'), tr(locale, 'Visita tècnica amb fotos i materials previstos', 'Visita técnica con fotos y materiales previstos', 'Site visit with photos and planned materials', 'Sopralluogo con foto e materiali previsti'), proposal ? tr(locale, 'Pressupost enviat amb 3 partides', 'Presupuesto enviado con 3 partidas', 'Quote sent with 3 line items', 'Preventivo inviato con 3 voci') : tr(locale, 'Tasques comercials obertes al pipeline', 'Tareas comerciales abiertas en el pipeline', 'Open sales tasks in the pipeline', 'Task commerciali aperte nel pipeline')] };
}
function tr(locale: string, ca: string, es: string, en: string, it: string) { return locale === 'en' ? en : locale === 'es' ? es : locale === 'it' ? it : ca; }
function StageIcon({ stage }: { stage: LeadStage }) { const c = stage === 'Nou' ? 'text-[#6b7cff]' : stage === 'Qualificat' ? 'text-[#00c2d7]' : stage === 'Proposta' ? 'text-[#facc15]' : 'text-[#22c55e]'; const icon = stage === 'Tancat' ? <Check className="h-4 w-4" /> : stage === 'Proposta' ? <FileText className="h-4 w-4" /> : stage === 'Qualificat' ? <Target className="h-4 w-4" /> : <Circle className="h-4 w-4" />; return <span className={c}>{icon}</span>; }
function StageMenu({ value, onChange }: { value: LeadStage; onChange: (stage: LeadStage) => void }) { const [open, setOpen] = useState(false); const ui = useSoftwareText(); return <div className="relative"><button onClick={() => setOpen((v) => !v)} className="flex h-8 items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><span className="text-[#8a8f98]">{ui.t('phase')}</span><StageIcon stage={value} /><span className="font-semibold">{ui.stage(value)}</span></button>{open ? <div className="absolute right-0 top-10 z-40 w-40 rounded-[7px] border border-[#c0c8d5] bg-white p-1 shadow-[0_16px_42px_rgba(8,9,10,0.16)] dark:border-[#323334] dark:bg-[#08090a]">{stages.map((s) => <button key={s} onClick={() => { onChange(s); setOpen(false); }} className={`flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[12px] ${value === s ? 'bg-[#eceff4] dark:bg-[#161718]' : 'text-[#62666d] hover:bg-[#f4f6fa] dark:text-[#8a8f98] dark:hover:bg-[#161718]'}`}><StageIcon stage={s} />{ui.stage(s)}</button>)}</div> : null}</div>; }
