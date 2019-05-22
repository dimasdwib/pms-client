
export function Currency(value) {
  const str = parseFloat(value)
        .toFixed(2) // always two decimal digits
        .replace('.', ',') // replace decimal point character with ,
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  return str;
}