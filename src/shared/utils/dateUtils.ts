import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';

export const DatePeriodKeyword = {
  TODAY: 'today',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type DateKeywordType =
  (typeof DatePeriodKeyword)[keyof typeof DatePeriodKeyword];

export type DateRange = {
  startDate: Date;
  endDate: Date | undefined;
};

export const DATE_KEYWORD_TO_DATE_RANGE: Record<
  DateKeywordType,
  ({ referenceDate }: { referenceDate: Date }) => DateRange
> = {
  [DatePeriodKeyword.TODAY]: ({ referenceDate }) => ({
    startDate: referenceDate,
    endDate: undefined,
  }),
  [DatePeriodKeyword.MONTH]: ({ referenceDate }) => {
    // Get the start of the current month
    const startOfCurrentMonth = startOfMonth(referenceDate);

    // Get the end of the current month
    const endOfCurrentMonth = endOfMonth(referenceDate);

    return {
      startDate: startOfCurrentMonth,
      endDate: endOfCurrentMonth,
    };
  },
  [DatePeriodKeyword.YEAR]: ({ referenceDate }) => {
    // Get the start of the current year
    const startOfCurrentYear = startOfYear(referenceDate);

    // Get the end of the current year
    const endOfCurrentYear = endOfYear(referenceDate);

    return {
      startDate: startOfCurrentYear,
      endDate: endOfCurrentYear,
    };
  },
};
