/**
 * @file src/components/landing/v2/custom-software/InventoryView.tsx
 * @updated 2026-05-13
 * @summary Inventari professional amb stock, proveidors i reserves SAT.
 * @scope Estat client-side per filtrar, reservar i demanar materials.
 */
'use client';
import { useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BarChart3, CheckCircle2, CircleAlert, Clock3, Info as InfoIcon, PackageCheck, Plus, Search, ShoppingCart, Table2, Truck, X } from 'lucide-react';
import { FloatingTip } from './FloatingTip';
import { InventoryAnalytics } from './InventoryAnalytics';
import { InventoryMaterialDetail } from './InventoryMaterialDetail';
import { getMaterialProfile, type InventoryProfile } from './inventory-utils';
import type { Material, NewMaterial, StockState } from './model';
import { useSoftwareText } from './software-i18n';

type Props = { material: Material[]; targetMaterial?: string | null; materialName: string; onSetMaterialName: (value: string) => void; onAddMaterial: (input?: NewMaterial) => void; onIncrement: (id: string) => void };
type Filter = 'Tot' | StockState | 'Reservat' | 'Demanat';
type Row = { material: Material; profile: InventoryProfile };
const filters: Filter[] = ['Tot', 'OK', 'Baix', 'Crític', 'Reservat', 'Demanat'];
export function InventoryView({ material, targetMaterial, materialName, onSetMaterialName, onAddMaterial, onIncrement }: Props) {
  const ui = useSoftwareText();
  const columns = [[ui.t('material'), ui.tip('material')], [ui.t('stock'), ui.tip('stock')], [ui.t('status'), ui.tip('status')], [ui.t('supplier'), ui.tip('supplier')], [ui.t('sat'), ui.tip('sat')], [ui.t('action'), ui.tip('detail')]] as const;
  const [filter, setFilter] = useState<Filter>('Tot');
  const target = material.find((item) => item.name === targetMaterial || item.name.includes(targetMaterial ?? ''));
  const [selected, setSelected] = useState(target?.id ?? material[0]?.id ?? '');
  const [screen, setScreen] = useState<'list' | 'detail'>(target ? 'detail' : 'list');
  const [mode, setMode] = useState<'table' | 'analytics'>('table');
  const [query, setQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newQty, setNewQty] = useState('2');
  const [newMin, setNewMin] = useState('5');
  const [newCategory, setNewCategory] = useState('');
  const [newSupplier, setNewSupplier] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newLeadTime, setNewLeadTime] = useState('24 h');
  const [reserved, setReserved] = useState<Record<string, number>>({});
  const [ordered, setOrdered] = useState<Record<string, boolean>>({});
  const rows = useMemo(() => material.map((m) => ({ material: m, profile: getMaterialProfile(m, reserved[m.id] ?? 0, ordered[m.id] ?? false, ui.locale) })), [material, ordered, reserved, ui.locale]);
  const filtered = rows.filter((r) => (`${r.material.name} ${r.material.id} ${r.profile.category} ${r.profile.supplier} ${r.profile.supplierContact}`.toLowerCase().includes(query.trim().toLowerCase())) && (filter === 'Tot' || r.material.state === filter || (filter === 'Reservat' && r.profile.reserved > 0) || (filter === 'Demanat' && r.profile.ordered > 0)));
  const current = rows.find((r) => r.material.id === selected) ?? rows[0];
  const stockValue = rows.reduce((sum, r) => sum + r.profile.value, 0);
  const addReserve = (id: string) => setReserved((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }));
  const addOrder = (id: string) => setOrdered((p) => ({ ...p, [id]: true }));

  const openDetail = (id: string) => { setSelected(id); setScreen('detail'); };
  const submitMaterial = () => { onAddMaterial({ name: materialName, qty: Number(newQty) || 0, min: Number(newMin) || 1, category: newCategory, supplier: newSupplier, supplierContact: newContact, unitPrice: Number(newPrice) || undefined, leadTime: newLeadTime }); setNewQty('2'); setNewMin('5'); setNewCategory(''); setNewSupplier(''); setNewContact(''); setNewPrice(''); setNewLeadTime('24 h'); setOpenDialog(false); };

  if (screen === 'detail' && current) return <motion.div key="inventory-detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="h-full"><InventoryMaterialDetail material={current.material} profile={current.profile} onBack={() => setScreen('list')} onIncrement={() => onIncrement(current.material.id)} onReserve={() => addReserve(current.material.id)} onOrder={() => addOrder(current.material.id)} /></motion.div>;

  return (
    <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative h-full overflow-hidden rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.055),transparent_26%),linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]">
      <section className="flex h-full flex-col">
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-[#d0d6e0] px-2 py-2 dark:border-[#23252a]">
          <div className="flex flex-wrap items-center gap-1 text-[12px] font-[560]">{filters.map((f) => <Tab key={f} label={f === 'Tot' ? ui.t('all') : f === 'Reservat' ? ui.t('reserved') : f === 'Demanat' ? ui.t('orderSupplier') : ui.stock(f)} active={filter === f} onClick={() => setFilter(f)} />)}</div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <button onClick={() => setMode(mode === 'table' ? 'analytics' : 'table')} className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[12px] font-semibold dark:border-[#323334] dark:bg-[#08090a]">{mode === 'table' ? <BarChart3 className="h-4 w-4" /> : <Table2 className="h-4 w-4" />}{mode === 'table' ? ui.t('charts') : ui.t('table')}</button>
            <MiniKpi icon={<PackageCheck className="h-3.5 w-3.5 text-[#6b7cff]" />} label={ui.kpi('refs')} value={String(material.length)} />
            <MiniKpi icon={<CircleAlert className="h-3.5 w-3.5 text-[#ef4444]" />} label={ui.kpi('critical')} value={String(material.filter((m) => m.state === 'Crític').length)} />
            <MiniKpi icon={<ShoppingCart className="h-3.5 w-3.5 text-[#facc15]" />} label={ui.kpi('orders')} value={String(rows.filter((r) => r.profile.ordered > 0).length)} />
            <MiniKpi icon={<CheckCircle2 className="h-3.5 w-3.5 text-[#22c55e]" />} label={ui.kpi('value')} value={`${Math.round(stockValue)}€`} />
            <label className="hidden h-8 items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a] md:flex"><Search className="h-3.5 w-3.5 text-[#8a8f98]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui.t('search')} className="w-32 bg-transparent outline-none placeholder:text-[#8a8f98]" /></label>
            <button onClick={() => setOpenDialog(true)} className="inline-flex h-8 items-center justify-center gap-2 rounded-[6px] bg-[#08090a] px-3 text-[12px] font-semibold text-white dark:bg-[#e4f222] dark:text-[#08090a]"><Plus className="h-4 w-4" />{ui.t('material')}</button>
          </div>
        </div>
        {mode === 'analytics' ? <InventoryAnalytics rows={rows} onDetail={openDetail} /> : <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[850px] text-left text-[13px]">
            <thead className="sticky top-0 z-10 border-b border-[#d0d6e0] bg-white/96 text-[#8a8f98] backdrop-blur dark:border-[#23252a] dark:bg-[#111213]/96"><tr>{columns.map(([label, tip]) => <th key={label} className="px-4 py-3 font-[520]"><ColumnHint label={label} tip={tip} /></th>)}</tr></thead>
            <tbody>{filtered.map((row) => <MaterialRow key={row.material.id} row={row} active={current?.material.id === row.material.id} onSelect={() => setSelected(row.material.id)} onIncrement={() => onIncrement(row.material.id)} onReserve={() => addReserve(row.material.id)} onDetail={() => openDetail(row.material.id)} />)}</tbody>
          </table>
        </div>}
      </section>
      {openDialog ? <MaterialDialog ui={ui} name={materialName} qty={newQty} min={newMin} category={newCategory} supplier={newSupplier} contact={newContact} price={newPrice} leadTime={newLeadTime} onName={onSetMaterialName} onQty={setNewQty} onMin={setNewMin} onCategory={setNewCategory} onSupplier={setNewSupplier} onContact={setNewContact} onPrice={setNewPrice} onLeadTime={setNewLeadTime} onClose={() => setOpenDialog(false)} onSubmit={submitMaterial} /> : null}
    </motion.div>
  );
}

function MaterialRow({ row, active, onSelect, onIncrement, onReserve, onDetail }: { row: Row; active: boolean; onSelect: () => void; onIncrement: () => void; onReserve: () => void; onDetail: () => void }) {
  const ui = useSoftwareText();
  return <tr onClick={() => { onSelect(); onDetail(); }} className={`cursor-pointer border-b border-[#d0d6e0]/70 bg-white transition hover:bg-[#f4f6fa] dark:border-[#23252a]/80 dark:bg-transparent dark:hover:bg-[#171819] ${active ? 'bg-[#f4f6fa] dark:bg-[#151617]' : ''}`}>
    <td className="px-4 py-4"><p className="font-[590]">{row.material.name}</p><p className="text-[11px] text-[#8a8f98]">{row.material.id} · {row.profile.category}</p></td>
    <td className="px-4 py-4"><p className="font-[560]">{row.material.qty} {ui.t('units')}</p><p className="text-[11px] text-[#8a8f98]">{ui.t('minStock')} {row.material.min} · {ui.t('available')} {row.profile.available}</p></td>
    <td className="px-4 py-4"><StockMark state={row.material.state} /></td>
    <td className="px-4 py-4"><p>{row.profile.supplier}</p><p className="text-[11px] text-[#8a8f98]"><Truck className="mr-1 inline h-3 w-3" />{row.profile.leadTime}</p></td>
    <td className="px-4 py-4"><p className="text-[12px]">{row.profile.reserved} {ui.t('reserved')}</p><p className="text-[11px] text-[#8a8f98]">{row.profile.ordered ? `${row.profile.ordered} ${ui.t('orderSupplier')}` : ui.t('noOrder')}</p></td>
    <td className="px-4 py-4"><div className="flex items-center gap-1"><SmallAction label="+1" onClick={onIncrement} /><SmallAction label={ui.t('reserveSat')} onClick={onReserve} /><DetailButton onDetail={onDetail} /></div></td>
  </tr>;
}

function ColumnHint({ label, tip }: { label: string; tip: string }) { return <FloatingTip text={tip} className="inline-flex cursor-help items-center gap-1.5 outline-none">{label}<InfoIcon className="h-3.5 w-3.5" /></FloatingTip>; }
function MiniKpi({ label, value, icon }: { label: string; value: string; icon: ReactNode }) { return <div className="hidden h-8 items-center gap-1.5 rounded-[6px] border border-[#d0d6e0] bg-[#f7f8f8] px-2 text-[11px] dark:border-[#323334] dark:bg-[#08090a] sm:flex">{icon}<span className="text-[#8a8f98]">{label}</span><strong className="text-[12px] font-semibold">{value}</strong></div>; }
function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`rounded-[5px] px-2 py-1 transition ${active ? 'bg-[#eceff4] text-[#08090a] dark:bg-[#1a1b1d] dark:text-[#f7f8f8]' : 'text-[#62666d] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]'}`}>{label}</button>; }
function SmallAction({ label, onClick }: { label: string; onClick: () => void }) { return <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="h-7 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[11px] font-semibold dark:border-[#323334] dark:bg-[#08090a]">{label}</button>; }
function DetailButton({ onDetail }: { onDetail: () => void }) { const ui = useSoftwareText(); return <button onClick={(e) => { e.stopPropagation(); onDetail(); }} className="inline-flex h-7 items-center gap-1 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[11px] font-semibold dark:border-[#323334] dark:bg-[#08090a]"><ArrowUpRight className="h-3.5 w-3.5" />{ui.t('detail')}</button>; }
function StockMark({ state }: { state: StockState }) { const ui = useSoftwareText(); const icon = state === 'Crític' ? <CircleAlert className="h-4 w-4" /> : state === 'Baix' ? <Clock3 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />; const cls = state === 'Crític' ? 'text-[#ef4444]' : state === 'Baix' ? 'text-[#ca8a04]' : 'text-[#16a34a]'; return <FloatingTip text={ui.stock(state)} className={`inline-flex ${cls}`}>{icon}</FloatingTip>; }
function MaterialDialog({ ui, name, qty, min, category, supplier, contact, price, leadTime, onName, onQty, onMin, onCategory, onSupplier, onContact, onPrice, onLeadTime, onClose, onSubmit }: { ui: ReturnType<typeof useSoftwareText>; name: string; qty: string; min: string; category: string; supplier: string; contact: string; price: string; leadTime: string; onName: (v: string) => void; onQty: (v: string) => void; onMin: (v: string) => void; onCategory: (v: string) => void; onSupplier: (v: string) => void; onContact: (v: string) => void; onPrice: (v: string) => void; onLeadTime: (v: string) => void; onClose: () => void; onSubmit: () => void }) { return <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[8px] bg-white/62 p-4 backdrop-blur-md dark:bg-[#08090a]/70"><div className="w-full max-w-2xl rounded-[10px] border border-[#d0d6e0] bg-[#f7f8f8] p-4 text-[#08090a] shadow-[0_24px_80px_rgba(8,9,10,0.22)] dark:border-[#323334] dark:bg-[#0f1011] dark:text-[#f7f8f8]"><div className="mb-3 flex items-start justify-between gap-3 border-b border-[#d0d6e0] pb-3 dark:border-[#23252a]"><div><h4 className="text-[16px] font-semibold">{ui.t('addMaterialTitle')}</h4><p className="mt-1 text-[12px] text-[#62666d] dark:text-[#8a8f98]">{ui.t('materialHelp')}</p></div><button onClick={onClose} className="rounded-[6px] border border-[#c0c8d5] bg-white p-1 text-[#62666d] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#8a8f98]"><X className="h-4 w-4" /></button></div><div className="grid gap-3 sm:grid-cols-2"><Field label={ui.t('material')} value={name} onChange={onName} className="sm:col-span-2" /><Field label={ui.t('category')} value={category} onChange={onCategory} /><Field label={ui.t('supplier')} value={supplier} onChange={onSupplier} /><Field label={ui.t('supplierContact')} value={contact} onChange={onContact} /><Field label={ui.t('leadTime')} value={leadTime} onChange={onLeadTime} /><Field label={ui.t('price')} value={price} onChange={onPrice} type="number" /><Field label={ui.t('initialStock')} value={qty} onChange={onQty} type="number" /><Field label={ui.t('minStock')} value={min} onChange={onMin} type="number" /></div><div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="h-10 rounded-[6px] border border-[#c0c8d5] bg-white px-4 text-[12px] font-semibold dark:border-[#323334] dark:bg-[#08090a]">{ui.t('cancel')}</button><button onClick={onSubmit} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">{ui.t('createMaterial')}</button></div></div></div>; }
function Field({ label, value, onChange, type = 'text', className = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) { return <label className={`text-[12px] ${className}`}><span className="mb-1 block text-[#62666d] dark:text-[#8a8f98]">{label}</span><input type={type} min={type === 'number' ? 0 : undefined} value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] outline-none dark:border-[#323334] dark:bg-[#08090a]" /></label>; }
