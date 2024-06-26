'use client';

import { formatUSDDecimal } from 'hihhhello-utils';
import React, { ChangeEvent, useEffect, useMemo, useRef } from 'react';

import { Input } from './Input';

type DollarInputProps = Omit<
  JSX.IntrinsicElements['input'],
  'onChange' | 'value' | 'type' | 'ref' | 'size'
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
  initialFocus?: boolean;
};

export const DollarInput = ({
  handleChange,
  handleValueChange,
  value,
  initialFocus,
  ...inputProps
}: DollarInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current || !initialFocus) {
      return;
    }

    ref.current.focus();
  }, [initialFocus]);

  const formattedValue = useMemo(() => {
    if (value === null) {
      return formatUSDDecimal(0);
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
      ref={ref}
      type="text"
      pattern="[0-9]*"
      inputMode="decimal"
      value={formattedValue}
      onChange={handleInputChange}
      {...inputProps}
    />
  );
};
