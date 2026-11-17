import { ApiReferencePager } from '@/components/api-reference/pager';
import { CodeBlock } from '@/components/code/code-block';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { API_REFERENCE_PATHS, createApiMetadata } from '@/lib/api-metadata';

export const metadata = createApiMetadata(API_REFERENCE_PATHS.parse);

const sample = `import { safeJsonParse, safeParse, safeParseWith, predicateToRefine, and, typedStruct, isString, isNumber } from 'is-kit';

const parseResult1 = safeParse(isString, 'ok');
if (parseResult1.valid) {
  parseResult1.value; // string
}

const isEven = predicateToRefine<number>((num) => num % 2 === 0);
const isEvenNumber = and(isNumber, isEven);
const parseEven = safeParseWith(isEvenNumber);
const parseResult2 = parseEven(4); // { valid: true, value: 4 }

type User = { id: string; name: string };
const isUser = typedStruct<User>()({ id: isString, name: isString });
const userResult = safeJsonParse('{"id":"1","name":"Ada"}', isUser);
// JSON is decoded to unknown, then validated without coercion.`;

const errorBoundarySample = `// Malformed JSON: JSON.parse fails, the error is caught.
safeJsonParse('{"broken":', isUser);
// { valid: false }

// Valid JSON that fails the guard (id is not coerced to a string).
safeJsonParse('{"id": 123, "name": "Ada"}', isUser);
// { valid: false }

// Exceptions thrown by the guard itself are not caught.
safeJsonParse('"hello"', (value): value is string => {
  throw new Error('guard failed');
});
// throws Error('guard failed')`;

export default function ParsePage() {
  return (
    <Stack variant='main' className='container mx-auto px-4 py-10' gap='xl'>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h1'>parse</Heading>
          <Paragraph>
            Runtime-safe validation helpers returning tagged results.
            safeJsonParse decodes JSON text to unknown before applying a guard.
          </Paragraph>
        </Stack>
        <CodeBlock code={sample} language='ts' />
      </Stack>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h2'>safeJsonParse error boundaries</Heading>
          <Paragraph>
            Only JSON decoding errors are caught. Malformed JSON text that
            JSON.parse rejects returns {'{ valid: false }'}. Successfully
            decoded JSON that does not satisfy the guard also returns{' '}
            {'{ valid: false }'}. Decoded values are never coerced: a number is
            not turned into a string to satisfy the guard.
          </Paragraph>
          <Paragraph>
            The guard is called outside the decoding try/catch, so an
            exception thrown by the supplied guard is not converted to{' '}
            {'{ valid: false }'}; it propagates to the caller. Wrap the call in
            your own try/catch only if your guard can throw.
          </Paragraph>
        </Stack>
        <CodeBlock code={errorBoundarySample} language='ts' />
      </Stack>
      <ApiReferencePager currentHref={API_REFERENCE_PATHS.parse} />
    </Stack>
  );
}
