export function hexToRgb (hex: string): [
  number,
  number,
  number
] {
  if (hex.length === 4) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];

    hex = `#${r}${r}${g}${g}${b}${b}`;
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}
