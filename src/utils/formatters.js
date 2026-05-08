/**
 * Normaliza textos removiendo tildes y caracteres especiales.
 * Ideal para comparaciones en barras de búsqueda y filtros.
 */
export function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Formatea valores numéricos como Moneda Colombiana (COP) sin decimales.
 * Ej: 12000 -> "$ 12.000"
 */
export function formatPrice(value) {
  const number = Number(String(value).replace(/[^\d]/g, ""));

  if (!Number.isFinite(number) || isNaN(number)) return "";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(number);
}
