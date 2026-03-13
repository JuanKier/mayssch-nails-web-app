// Feriados de Paraguay 2026
export const paraguayHolidays2026 = {
  '2026-01-01': 'Año Nuevo',
  '2026-03-01': 'Día de los Héroes',
  '2026-04-02': 'Jueves Santo',
  '2026-04-03': 'Viernes Santo',
  '2026-05-01': 'Día del Trabajador',
  '2026-05-14': 'Independencia Nacional',
  '2026-05-15': 'Independencia Nacional',
  '2026-06-12': 'Paz del Chaco',
  '2026-08-15': 'Fundación de Asunción',
  '2026-09-29': 'Victoria de Boquerón',
  '2026-12-08': 'Virgen de Caacupé',
  '2026-12-25': 'Navidad',
};

export function getHolidayName(date) {
  const dateStr = date.toISOString().split('T')[0];
  return paraguayHolidays2026[dateStr] || null;
}

export function isHoliday(date) {
  const dateStr = date.toISOString().split('T')[0];
  return dateStr in paraguayHolidays2026;
}

export function isSunday(date) {
  return date.getDay() === 0;
}
