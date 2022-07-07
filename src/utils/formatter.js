export function toAmount(amount) {
  const str = amount.toFixed(2) + ''
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
