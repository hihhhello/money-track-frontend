'use client';

import React, { ChangeEvent, useMemo } from 'react';
import { Input } from './Input';
import { formatUSDDecimal } from '../utils/helpers';

type DollarInputProps = Omit<
  JSX.IntrinsicElements['input'],
  'onChange' | 'value' | 'type' | 'ref'
> & {
  /**
   * @param value value with formatted toFixed(2).
   */
  handleValueChange?: (value: number) => void;

  /**
   * @param event the original event.
   */
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;

  value: number | null;
};

export const DollarInput = ({
  handleChange,
  handleValueChange,
  value,
  ...inputProps
}: DollarInputProps) => {
  const formattedValue = useMemo(() => {
    if (value === null) {
      return '';
    }

    return formatUSDDecimal(value);
  }, [value]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/[^0-9]/g, '');
    let numericValue = parseFloat(rawValue) / 100;

    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    handleValueChange?.(numericValue);
    handleChange?.(event);
  };

  return (
    <Input
      type="text"
      pattern="[0-9]*"
      inputMode="decimal"
      value={formattedValue}
      onChange={handleInputChange}
      {...inputProps}
    />
  );
};
