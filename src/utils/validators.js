// RN010 — e-mail com formato válido
export const emailValido = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

// RN009 — campo obrigatório não pode ir vazio
export const preenchido = (v) => String(v ?? '').trim().length > 0;

export const telefoneValido = (v = '') => {
  const d = v.replace(/\D/g, '');
  return d.length === 0 || d.length === 10 || d.length === 11;
};

export function mascararTelefone(v = '') {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const EXTENSOES_3D = ['stl', 'obj', 'step', 'stp'];

export function arquivo3DValido(nome = '') {
  const ext = nome.split('.').pop()?.toLowerCase();
  return EXTENSOES_3D.includes(ext);
}
