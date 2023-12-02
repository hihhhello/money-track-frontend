import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '../types/globalTypes';

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

export function createUrlWithSearchParams(params: {
  url: string;
  searchParams?: Record<string, string | number>;
}): string {
  const { url, searchParams } = params;
  if (!searchParams || Object.keys(searchParams).length === 0) {
    return url;
  }

  const searchParamsString = Object.entries(searchParams)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');

  return `${url}?${searchParamsString}`;
}

export const getNetAmount = (transaction: {
  amount: string;
  type: FinancialOperationTypeValue;
}) => {
  if (transaction.type === FinancialOperationType.DEPOSIT) {
    return parseFloat(transaction.amount);
  }

  return -parseFloat(transaction.amount);
};
