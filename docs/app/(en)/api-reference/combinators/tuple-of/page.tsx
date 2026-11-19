import { ApiReferencePager } from '@/components/api-reference/pager';
import { CodeBlock } from '@/components/code/code-block';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { API_REFERENCE_PATHS, createApiMetadata } from '@/lib/api-metadata';

export const metadata = createApiMetadata(API_REFERENCE_PATHS.tupleOf);

const sample = `import { tupleOf, isString, isNumber } from 'is-kit';

// Use varargs with tupleOf for best inference
const isPair = tupleOf(isString, isNumber);
isPair(['x', 1]); // true
isPair(['x']); // false`;

export default function TupleOfPage() {
  return (
    <Stack variant='main' className='container mx-auto px-4 py-10' gap='xl'>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h1'>tupleOf</Heading>
          <Paragraph>
            Guard for fixed-length tuples with per-index guards.
          </Paragraph>
        </Stack>
        <CodeBlock code={sample} language='ts' />
      </Stack>
      <Stack variant='section' gap='sm'>
        <Stack gap='xs'>
          <Heading variant='h2'>Behavior details</Heading>
          <Paragraph>
            The input must be a real array (<code>Array.isArray</code> check).
            Array-like objects, strings, null, and undefined are rejected.
          </Paragraph>
        </Stack>
        <CodeBlock
          code={`import { tupleOf, isString, isNumber, isUndefined } from 'is-kit';

const isPair = tupleOf(isString, isNumber);

// Rejected: not an array
isPair('ab'); // false
isPair({ 0: 'x', 1: 1, length: 2 }); // false
isPair(null); // false

// Rejected: length mismatch (no guard invoked)
isPair(['x']); // false
isPair(['x', 1, 'extra']); // false

// Sparse array: hole reads as undefined
isPair([, 1]); // false (hole becomes undefined, isString(undefined) fails)

// Hole accepted when guard accepts undefined
tupleOf(isUndefined, isNumber)([, 1]); // true

// Empty tuple accepts only empty array
tupleOf()([]); // true
tupleOf()([1]); // false`}
          language='ts'
        />
        <Paragraph>
          Length is checked first; on mismatch, no element guards run. Guards
          execute in index order and short-circuit at the first failure.
        </Paragraph>
      </Stack>
      <ApiReferencePager currentHref={API_REFERENCE_PATHS.tupleOf} />
    </Stack>
  );
}
