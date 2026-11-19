import { ApiReferencePager } from '@/components/api-reference/pager';
import { CodeBlock } from '@/components/code/code-block';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { API_REFERENCE_PATHS, createApiMetadata } from '@/lib/api-metadata';

export const metadata = createApiMetadata(API_REFERENCE_PATHS.oneOfValues);

const sample = `import { oneOfValues } from 'is-kit';

const isHttpMethod = oneOfValues(['GET', 'POST', 'PUT', 'DELETE'] as const);
isHttpMethod('POST'); // true
isHttpMethod('PATCH'); // false`;

const equalitySample = `const isNaNOnly = oneOfValues(NaN);
isNaNOnly(NaN); // true (NaN matches NaN, unlike ===)

const isPositiveZero = oneOfValues(0);
isPositiveZero(0); // true
isPositiveZero(-0); // false (+0 and -0 are different values)

const isNegativeZero = oneOfValues(-0);
isNegativeZero(-0); // true
isNegativeZero(0); // false

const isOne = oneOfValues(1);
isOne('1'); // false (no type coercion)`;

const formsSample = `// Values as arguments
const isDirection = oneOfValues('up', 'down');

// The same values as a single readonly array
const isSameDirection = oneOfValues(['up', 'down'] as const);

isDirection('up'); // true
isSameDirection('down'); // true`;

const snapshotSample = `const values = ['admin'] as string[];
const isRole = oneOfValues(values);

values.push('guest');

isRole('admin'); // true
isRole('guest'); // false`;

export default function OneOfValuesPage() {
  return (
    <Stack variant='main' className='container mx-auto px-4 py-10' gap='xl'>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h1'>oneOfValues</Heading>
          <Paragraph>
            Guard for literal value sets; uses exact equality semantics. The
            guard narrows to the union of the values you pass.
          </Paragraph>
        </Stack>
        <CodeBlock code={sample} language='ts' />
      </Stack>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h2'>Exact equality</Heading>
          <Paragraph>
            Each input is compared with <code>Object.is</code>, so values are
            never coerced. <code>NaN</code> matches <code>NaN</code>, and{' '}
            <code>+0</code> and <code>-0</code> are different values: a guard
            created with <code>0</code> rejects <code>-0</code>, and a guard
            created with <code>-0</code> rejects <code>0</code>.
          </Paragraph>
        </Stack>
        <CodeBlock code={equalitySample} language='ts' />
      </Stack>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h2'>Arguments or an array</Heading>
          <Paragraph>
            Pass the values as separate arguments or as a single readonly array.
            Both forms accept the same values and narrow the same way.
          </Paragraph>
        </Stack>
        <CodeBlock code={formsSample} language='ts' />
      </Stack>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h2'>Values are captured at creation</Heading>
          <Paragraph>
            The guard copies its accepted values when it is created. Changing
            the original array afterwards does not change what the guard
            accepts.
          </Paragraph>
        </Stack>
        <CodeBlock code={snapshotSample} language='ts' />
      </Stack>
      <ApiReferencePager currentHref={API_REFERENCE_PATHS.oneOfValues} />
    </Stack>
  );
}
