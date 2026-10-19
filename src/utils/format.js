export function formatarPreco(valor) {
  const n = Number(valor) || 0;
  const [inteiro, dec] = n.toFixed(2).split('.');
  const milhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${milhar},${dec}`;
}

export function formatarPrecoGrama(valor) {
  const n = Number(valor) || 0;
  return `R$ ${n.toFixed(2).replace('.', ',')} / g`;
}

export function formatarData(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()} às ${hh}:${mi}`;
}

export function primeiroNome(nome = '') {
  return nome.trim().split(/\s+/)[0] || '';
}
