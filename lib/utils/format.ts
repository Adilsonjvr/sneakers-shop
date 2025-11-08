export const formatCurrency = (value: number, currency: string = 'EUR') =>
  new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);

export const formatPercent = (value: number) =>
  `${value.toFixed(1).replace('.', ',')}%`;

export const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(typeof date === 'string' ? new Date(date) : date);
