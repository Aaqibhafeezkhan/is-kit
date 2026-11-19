import { define } from '../define';
import type { Predicate, GuardedOf } from '@/types';
import { hasTupleValues } from '@/utils/guard-collections';

/**
 * Validates a fixed-length tuple by applying element-wise guards.
 *
 * The input must be a real array (`Array.isArray` check). Array-like objects,
 * strings, null, and undefined are rejected. Length must exactly match the number
 * of guards; on mismatch, no element guards are invoked. Guards run in index order
 * and short-circuit at the first failure. Sparse arrays read holes as `undefined`,
 * so a hole passes only if the guard at that index accepts `undefined`.
 *
 * @param guards Guards corresponding to each tuple position.
 * @returns Predicate that narrows to a readonly tuple of guarded element types.
 */
export function tupleOf<const Fs extends readonly Predicate<unknown>[]>(
  ...guards: Fs
): Predicate<{ readonly [K in keyof Fs]: GuardedOf<Fs[K]> }> {
  return define<{ readonly [K in keyof Fs]: GuardedOf<Fs[K]> }>(
    (input) => Array.isArray(input) && hasTupleValues(input, guards)
  );
}
