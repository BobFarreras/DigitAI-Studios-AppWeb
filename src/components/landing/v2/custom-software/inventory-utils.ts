/**
 * @file src/components/landing/v2/custom-software/inventory-utils.ts
 * @updated 2026-05-13
 * @summary Perfil derivat per a materials, stock i proveidors.
 * @scope Utilitats client-side sense estat React.
 */

import type { Material } from './model';

export type InventoryProfile = {
  category: string;
  supplier: string;
  supplierContact: string;
  leadTime: string;
  location: string;
  unitPrice: number;
  reserved: number;
  ordered: number;
  reorderQty: number;
  available: number;
  value: number;
  monthlyUse: number;
  priceDelta: number;
  alternativeSupplier: string;
  alternativePrice: number;
  saving: number;
  recommendation: string;
  history: string[];
};

export function getMaterialProfile(material: Material, reservedExtra: number, orderedFlag: boolean): InventoryProfile {
  const category = material.category || getCategory(material.name);
  const supplier = material.supplier || getSupplier(category);
  const supplierContact = material.supplierContact || getSupplierContact(supplier);
  const leadTime = material.leadTime || (category === 'Calderes' || category === 'Bombes' ? '48-72 h' : '24 h');
  const unitPrice = material.unitPrice ?? getUnitPrice(category, material.name);
  const baseReserved = material.state === 'OK' ? (material.id.endsWith('011') ? 2 : 0) : 1;
  const reserved = Math.min(material.qty, baseReserved + reservedExtra);
  const reorderQty = Math.max(material.min * 2 - material.qty, material.min);
  const ordered = orderedFlag || material.state === 'Crític' ? reorderQty : 0;
  const available = Math.max(0, material.qty - reserved);
  const value = material.qty * unitPrice;
  const monthlyUse = getMonthlyUse(material.name, category);
  const priceDelta = getPriceDelta(material.id);
  const alternativeSupplier = getAlternativeSupplier(supplier);
  const alternativePrice = Number((unitPrice * (priceDelta > 8 ? 0.88 : 0.96)).toFixed(2));
  const saving = Number(Math.max(0, unitPrice - alternativePrice).toFixed(2));
  const recommendation = getRecommendation(material, reorderQty, saving, alternativeSupplier);
  return { category, supplier, supplierContact, leadTime, location: material.location || getLocation(category), unitPrice, reserved, ordered, reorderQty, available, value, monthlyUse, priceDelta, alternativeSupplier, alternativePrice, saving, recommendation, history: getHistory(material, reserved, ordered) };
}

function getCategory(name: string) {
  if (name.includes('Caldera') || name.includes('Vàlvula')) return 'Calderes';
  if (name.includes('Bomba') || name.includes('Vas')) return 'Bombes';
  if (name.includes('Termo')) return 'ACS';
  if (name.includes('Clau') || name.includes('Aixeta')) return 'Valvuleria';
  if (name.includes('Gas')) return 'Gas';
  if (name.includes('Sifó') || name.includes('desaig')) return 'Desaigües';
  return 'Consumibles';
}

function getSupplier(category: string) {
  if (category === 'Calderes') return 'TermoRecambios Pro';
  if (category === 'Bombes') return 'InstalSupply Girona';
  if (category === 'Gas') return 'GasTec Homologat';
  if (category === 'ACS') return 'HidroTermic';
  if (category === 'Valvuleria') return 'AquaControl Pro';
  return 'HidroParts Girona';
}

function getLocation(category: string) {
  if (category === 'Consumibles') return 'Magatzem A · prestatge 2';
  if (category === 'Calderes' || category === 'ACS') return 'Magatzem B · zona tèrmica';
  if (category === 'Bombes') return 'Magatzem B · palet 4';
  if (category === 'Valvuleria') return 'Magatzem A · calaix 6';
  return 'Furgoneta SAT 02';
}

function getUnitPrice(category: string, name: string) {
  if (name.includes('Termo')) return 186;
  if (name.includes('Vàlvula')) return 92;
  if (name.includes('Clau')) return 18;
  if (name.includes('Aixeta')) return 64;
  if (category === 'Bombes') return 245;
  if (category === 'Gas') return 38;
  if (category === 'Desaigües') return 24;
  return 3.8;
}

function getMonthlyUse(name: string, category: string) {
  if (name.includes('Junta') || name.includes('Tefló')) return 42;
  if (category === 'Desaigües') return 18;
  if (category === 'Calderes') return 9;
  if (category === 'Bombes') return 5;
  return 12;
}

function getPriceDelta(id: string) {
  const numeric = Number(id.replace(/\D/g, ''));
  if (numeric % 5 === 0) return 14;
  if (numeric % 3 === 0) return 7;
  if (numeric % 2 === 0) return -3;
  return 2;
}

function getAlternativeSupplier(supplier: string) {
  if (supplier === 'HidroParts Girona') return 'Recambios Nord';
  if (supplier === 'TermoRecambios Pro') return 'CalorPlus Distribució';
  if (supplier === 'InstalSupply Girona') return 'Bombes Costa';
  return 'HidroMarket Pro';
}

function getSupplierContact(supplier: string) {
  if (supplier === 'TermoRecambios Pro') return 'Laia Bosch · 972 410 220';
  if (supplier === 'InstalSupply Girona') return 'Pau Ferrer · 972 118 904';
  if (supplier === 'AquaControl Pro') return 'Gemma Rius · 972 882 100';
  return 'Marc Vidal · 972 300 145';
}

function getRecommendation(material: Material, reorderQty: number, saving: number, supplier: string) {
  if (material.state === 'Crític') return `Demanar ${reorderQty} unitats avui. Alternativa: ${supplier}.`;
  if (saving > 6) return `Revisar compra: ${supplier} estalvia ${saving.toFixed(2)} €/unitat.`;
  if (material.state === 'Baix') return `Preparar comanda de ${reorderQty} unitats.`;
  return 'Stock correcte per a les ordres actives.';
}

function getHistory(material: Material, reserved: number, ordered: number) {
  return [
    `Inventari revisat: ${material.qty} unitats, mínim ${material.min}.`,
    reserved > 0 ? `${reserved} unitats reservades per ordres SAT.` : 'Sense reserves actives.',
    ordered > 0 ? `Comanda oberta de ${ordered} unitats al proveïdor.` : 'Sense comandes pendents.',
  ];
}
