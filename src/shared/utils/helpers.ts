import { compact } from 'lodash';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '../types/globalTypes';

export const classNames = (...classes: (string | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

const usdDecimalFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatUSDDecimal = (value: number | undefined) => {
  if (value === undefined) {
    return '';
  }
  return usdDecimalFormatter.format(value);
};

const usdCompactFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

export const formatUSDCompact = (value: number) =>
  usdCompactFormatter.format(value);

const usdIntegerFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatUSDInteger = (value: number | undefined) => {
  if (value === undefined) {
    return '';
  }

  return usdIntegerFormatter.format(value);
};

export function createUrlWithSearchParams(params: {
  url: string;
  searchParams?: Record<string, string | number | undefined>;
}): string {
  const { url, searchParams } = params;
  if (!searchParams || Object.keys(searchParams).length === 0) {
    return url;
  }

  const searchParamsString = compact(
    Object.entries(searchParams).map(([key, value]) =>
      value
        ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        : undefined,
    ),
  ).join('&');

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
