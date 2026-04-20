/**
 * Almacenes en memoria cuando no hay API real (VITE_FRONTEND_ONLY distinto de "false").
 * Fuente única de verdad para listar / crear / editar / borrar hasta conectar backend.
 */

const SEED = [
  {
    warehouseId: 'demo-wh-1',
    name: 'Almacén central',
    street: 'Av. Demo 123',
    city: 'Lima',
    district: 'Miraflores',
    postalCode: '15074',
    country: 'PE',
    maxTemperature: 25,
    minTemperature: 10,
    capacity: 100,
    imageUrl: '',
    profileId: '',
  },
];

/** @type {typeof SEED} */
let rows = SEED.map((r) => ({ ...r }));

function newWarehouseId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `wh-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function num(x, d = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : d;
}

/** @param {Record<string, string>} o */
function rowFromFields(o, warehouseId) {
  return {
    warehouseId,
    name: o.Name ?? o.name ?? '',
    street: o.Street ?? o.street ?? '',
    city: o.City ?? o.city ?? '',
    district: o.District ?? o.district ?? '',
    postalCode: o.PostalCode ?? o.postalCode ?? '',
    country: o.Country ?? o.country ?? '',
    maxTemperature: num(o.MaxTemperature ?? o.maxTemperature, 0),
    minTemperature: num(o.MinTemperature ?? o.minTemperature, 0),
    capacity: num(o.Capacity ?? o.capacity, 0),
    imageUrl: '',
    profileId: '',
  };
}

/**
 * Crea una fila desde el objeto del formulario (WarehouseForm).
 * @param {object} form — { name, street, city, ... }
 */
export function warehouseDevCreate(form) {
  const id = newWarehouseId();
  const flat = {
    name: form.name,
    street: form.street,
    city: form.city,
    district: form.district,
    postalCode: form.postalCode,
    country: form.country,
    maxTemperature: form.maxTemperature,
    minTemperature: form.minTemperature,
    capacity: form.capacity,
  };
  const row = rowFromFields(flat, id);
  rows.push(row);
  return { ...row };
}

/**
 * @param {unknown} data — FormData (axios mock) u objeto
 */
export function warehouseDevCreateFromFormData(data) {
  const o = {};
  if (data instanceof FormData) {
    for (const [k, v] of data.entries()) {
      if (v instanceof File) continue;
      o[k] = typeof v === 'string' ? v : String(v);
    }
  } else if (data && typeof data === 'object') {
    Object.assign(o, data);
  }
  const id = newWarehouseId();
  const row = rowFromFields(o, id);
  rows.push(row);
  return { ...row };
}

export function warehouseDevList() {
  return rows.map((r) => ({ ...r }));
}

export function warehouseDevGetById(id) {
  const r = rows.find((x) => x.warehouseId === id);
  return r ? { ...r } : null;
}

export function warehouseDevUpdate(id, form) {
  const i = rows.findIndex((x) => x.warehouseId === id);
  if (i < 0) return null;
  const flat = {
    name: form.name,
    street: form.street,
    city: form.city,
    district: form.district,
    postalCode: form.postalCode,
    country: form.country,
    maxTemperature: form.maxTemperature,
    minTemperature: form.minTemperature,
    capacity: form.capacity,
  };
  rows[i] = { ...rows[i], ...rowFromFields(flat, id) };
  return { ...rows[i] };
}

export function warehouseDevUpdateFromFormData(id, data) {
  const o = {};
  if (data instanceof FormData) {
    for (const [k, v] of data.entries()) {
      if (v instanceof File) continue;
      o[k] = typeof v === 'string' ? v : String(v);
    }
  } else if (data && typeof data === 'object') {
    Object.assign(o, data);
  }
  const i = rows.findIndex((x) => x.warehouseId === id);
  if (i < 0) return { success: true };
  rows[i] = { ...rows[i], ...rowFromFields(o, id) };
  return { ...rows[i] };
}

export function warehouseDevDelete(id) {
  const i = rows.findIndex((x) => x.warehouseId === id);
  if (i >= 0) rows.splice(i, 1);
}

export function warehouseDevCountPayload() {
  return { count: rows.length };
}

/** Para mocks HTTP: detalle por id o fila demo mínima. */
export function warehouseDevGetByIdOrPlaceholder(id) {
  const w = warehouseDevGetById(id);
  if (w) return { ...w };
  return { ...SEED[0], warehouseId: id || SEED[0].warehouseId };
}
