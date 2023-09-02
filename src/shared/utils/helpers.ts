export const classNames = (...classes: (string | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

const formatterUSDCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatToUSDCurrency = (value: number | undefined) => {
  if (value === undefined) {
    return '';
  }
  return formatterUSDCurrency.format(value);
};

const formatterCompactUSDCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

export const formatToCompactUSDCurrency = (value: number) =>
  formatterCompactUSDCurrency.format(value);

const formatterUSDCurrencyNoCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatToUSDCurrencyNoCents = (value: number | undefined) => {
  if (value === undefined) {
    return '';
  }

  return formatterUSDCurrencyNoCents.format(value);
};
