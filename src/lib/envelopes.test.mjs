/**
 * Run with: node --experimental-strip-types src/lib/envelopes.test.mjs
 *
 * The point of these is that the amounts must sum to the goal EXACTLY for any
 * goal and any envelope count. Rounding a hundred scaled amounts to the cent is
 * where that quietly stops being true.
 */
import { triangular, amountsInCents, summarise, money, duration, CLASSIC_TOTAL } from './envelopes.ts';

let fail = 0;
const ok = (name, cond, got) => { console.log(`${cond ? ' ok ' : 'FAIL'}  ${name}${cond ? '' : `  -> ${got}`}`); if (!cond) fail++; };

ok('triangular(100) = 5050', triangular(100) === 5050, triangular(100));
ok('CLASSIC_TOTAL = 5050', CLASSIC_TOTAL === 5050, CLASSIC_TOTAL);

// The classic run must come out as whole dollars 1..100.
const classic = amountsInCents(100, 505000);
ok('classic has 100 envelopes', classic.length === 100, classic.length);
ok('classic first = $1', classic[0] === 100, classic[0]);
ok('classic last = $100', classic[99] === 10000, classic[99]);
ok('classic sums to $5,050', classic.reduce((a, b) => a + b, 0) === 505000);
ok('classic amounts are exactly 1..100 dollars', classic.every((c, i) => c === (i + 1) * 100));

// Scaled goals must still sum EXACTLY to the goal, which is the whole point.
for (const [count, dollars] of [[100, 2000], [100, 1000], [50, 777.77], [12, 500], [365, 10000], [7, 33.33], [1, 5]]) {
  const cents = Math.round(dollars * 100);
  const a = amountsInCents(count, cents);
  const sum = a.reduce((x, y) => x + y, 0);
  ok(`${count} envelopes -> ${money(cents)} sums exactly`, sum === cents, `${sum} vs ${cents}`);
  ok(`  ${count}/${dollars} is ascending`, a.every((v, i) => i === 0 || v >= a[i - 1]));
  ok(`  ${count}/${dollars} has no negative`, a.every((v) => v >= 0));
}

// The worked example quoted on the page.
const ex = amountsInCents(100, 200000);
ok('$2,000 example: first = $0.40', ex[0] === 40, ex[0]);
ok('$2,000 example: last = $39.60', ex[99] === 3960, ex[99]);
ok('$2,000 example: 50th = $19.80', ex[49] === 1980, ex[49]);

const s = summarise(100, 505000, 1);
ok('summary flags classic', s.isClassic === true);
ok('summary days = 100', s.days === 100, s.days);
ok('summary average = $50.50', s.averageCents === 5050, s.averageCents);
ok('summarise(100, 200000) not classic', summarise(100, 200000, 1).isClassic === false);

ok('money whole', money(505000) === '$5,050', money(505000));
ok('money cents', money(3960) === '$39.60', money(3960));
ok('duration 100d', duration(100) === '3 months and 1 week', duration(100));
ok('duration 700d', duration(700) === '1 year and 11 months', duration(700));
ok('duration 7d', duration(7) === '7 days', duration(7));
ok('duration 365d', duration(365) === '1 year', duration(365));
ok('duration 300d rolls 4 weeks into a month', duration(300) === '10 months', duration(300));
ok('duration 1400d', duration(1400) === '3 years and 10 months', duration(1400));

console.log(fail ? `\n${fail} FAILURES` : '\nall passed');
process.exit(fail ? 1 : 0);
