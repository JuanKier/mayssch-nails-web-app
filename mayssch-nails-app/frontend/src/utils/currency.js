// Formato de moneda paraguaya (Guaraníes)
export function formatGuaranies(amount) {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('es-PY')} Gs`;
}

// Parsear guaraníes a número
export function parseGuaranies(str) {
  return parseInt(str.replace(/[^\d]/g, '')) || 0;
}
