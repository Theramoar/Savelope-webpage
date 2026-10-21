/**
 * The envelope-challenge arithmetic, shared by the server render and the browser.
 *
 * Both the static worked example and the interactive calculator import this, so
 * the page cannot end up showing one set of numbers before JavaScript runs and a
 * different set after.
 *
 * Money is handled in whole cents throughout. Floating-point dollars drift once
 * you scale a hundred of them by a repeating fraction, and a chart that does not
 * add up to the stated goal is worse than no chart.
 */

/** 1 + 2 + … + n. The classic challenge is triangular(100) = 5050. */
export const triangular = (n: number): number => (n * (n + 1)) / 2;

export const CLASSIC_COUNT = 100;
export const CLASSIC_TOTAL = triangular(CLASSIC_COUNT);

export interface Pace {
  id: string;
  label: string;
  /** Days between one envelope and the next. */
  step: number;
}

export const PACES: Pace[] = [
  { id: 'daily', label: 'One a day', step: 1 },
  { id: 'alternate', label: 'Every other day', step: 2 },
  { id: 'twice-weekly', label: 'Twice a week', step: 3.5 },
  { id: 'weekly', label: 'One a week', step: 7 },
  { id: 'fortnightly', label: 'One a fortnight', step: 14 },
  { id: 'monthly', label: 'One a month', step: 30.44 },
];

/**
 * The amount in each envelope, in cents, smallest first.
 *
 * Amounts keep the 1 : 2 : 3 … : n shape of the original challenge and are scaled
 * so they sum to `totalCents` exactly. Rounding each envelope to the cent leaves a
 * remainder of a few cents at most; it goes on the largest envelope, where it is
 * proportionally invisible.
 */
export function amountsInCents(count: number, totalCents: number): number[] {
  if (!Number.isFinite(count) || count < 1) return [];
  const n = Math.floor(count);
  const tri = triangular(n);
  const amounts: number[] = [];
  let running = 0;

  for (let i = 1; i <= n; i++) {
    const cents = Math.round((totalCents * i) / tri);
    amounts.push(cents);
    running += cents;
  }

  amounts[n - 1] += totalCents - running;
  return amounts;
}

export interface Summary {
  count: number;
  totalCents: number;
  smallestCents: number;
  largestCents: number;
  averageCents: number;
  /** Calendar days from the first envelope to the last. */
  days: number;
  /** Whether the amounts are the plain $1, $2, … $n of the classic challenge. */
  isClassic: boolean;
}

export function summarise(count: number, totalCents: number, step: number): Summary {
  const amounts = amountsInCents(count, totalCents);
  return {
    count,
    totalCents,
    smallestCents: amounts[0] ?? 0,
    largestCents: amounts[amounts.length - 1] ?? 0,
    averageCents: Math.round(totalCents / count),
    days: Math.round(count * step),
    isClassic: totalCents === triangular(count) * 100,
  };
}

/** $1,234.56, dropping the cents when they are zero. */
export function money(cents: number): string {
  const whole = cents / 100;
  const hasCents = cents % 100 !== 0;
  return `$${whole.toLocaleString('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/** "3 months and 1 week", from a number of days. */
export function duration(days: number): string {
  if (days < 14) return `${days} days`;
  if (days < 70) return `${Math.round(days / 7)} weeks`;

  const months = days / 30.44;

  // A year is 12 * 30.44 = 365.28 days, so flooring would call 700 days
  // 22 months — one short — and report 1 year 10 months for what everyone
  // else calls 1 year 11 months. Round once we are into years.
  if (months >= 11.5) {
    const whole = Math.round(months);
    const years = Math.floor(whole / 12);
    const rem = whole % 12;
    const y = `${years} year${years === 1 ? '' : 's'}`;
    return rem ? `${y} and ${rem} month${rem === 1 ? '' : 's'}` : y;
  }

  let whole = Math.floor(months);
  let weeks = Math.round((days - whole * 30.44) / 7);
  if (weeks >= 4) {
    whole += 1;
    weeks = 0;
  }
  const m = `${whole} month${whole === 1 ? '' : 's'}`;
  return weeks ? `${m} and ${weeks} week${weeks === 1 ? '' : 's'}` : m;
}
