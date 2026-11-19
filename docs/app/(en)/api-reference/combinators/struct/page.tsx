import { ApiReferencePager } from '@/components/api-reference/pager';
import { CodeBlock } from '@/components/code/code-block';
import { GuideTable } from '@/components/guides/guide-table';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { TextLink } from '@/components/ui/text-link';
import { API_REFERENCE_PATHS, createApiMetadata } from '@/lib/api-metadata';

export const metadata = createApiMetadata(API_REFERENCE_PATHS.struct);

const sample = `import {
  arrayOf,
  optional,
  optionalKey,
  struct,
  isString,
  isNumber,
} from 'is-kit';

const isUser = struct({
  id: isNumber,
  name: isString,
  nickname: optionalKey(isString),
  displayName: optionalKey(optional(isString)),
});
// isUser: Guard<{
//   id: number;
//   name: string;
//   nickname?: string;
//   displayName?: string | undefined;
// }>

const input: unknown = {
  id: 42,
  name: 'Neko',
  nickname: 'nya',
};

if (isUser(input)) {
  input.nickname?.toUpperCase(); // input narrowed to User shape
}

const isExactUser = struct(
  { id: isNumber, name: isString },
  { exact: true }
);
isExactUser({ id: 1, name: 'A' }); // true
isExactUser({ id: 1, name: 'A', extra: 1 }); // false (extra keys rejected)

const isTeam = struct({
  name: isString,
  members: arrayOf(isUser),
});
// Nested structs compose cleanly; members inherits the User guard.

isTeam({
  name: 'core',
  members: [{ id: 1, name: 'Neko' }],
}); // true
isTeam({
  name: 'core',
  members: [{ id: 1, name: 'Neko', nickname: 123 }],
}); // false (nickname is not a string)

// Use optionalKey(...) when the property may be omitted.
// Use optional(...) when the property exists but its value may be undefined.`;

const optionalityRows = [
  {
    key: 'optional',
    cells: [
      <code key='schema'>tag: optional(isString)</code>,
      'Yes',
      'Yes',
      'No',
      <code key='type'>tag: string | undefined</code>
    ]
  },
  {
    key: 'optional-key',
    cells: [
      <code key='schema'>tag: optionalKey(isString)</code>,
      'Yes',
      'No',
      'Yes',
      <code key='type'>tag?: string</code>
    ]
  },
  {
    key: 'optional-key-optional',
    cells: [
      <code key='schema'>tag: optionalKey(optional(isString))</code>,
      'Yes',
      'Yes',
      'Yes',
      <code key='type'>tag?: string | undefined</code>
    ]
  }
] as const;

const payloadSample = `import { isNumber, isString, optional, optionalKey, struct } from 'is-kit';

const tag: string | undefined = undefined;

// Building an object from a maybe-undefined variable keeps the key.
const payload = { id: 1, tag }; // { id: 1, tag: undefined }
struct({ id: isNumber, tag: optionalKey(isString) })(payload); // false

// JSON.stringify drops properties whose value is undefined.
const received = JSON.parse(JSON.stringify(payload)); // { id: 1 }
struct({ id: isNumber, tag: optional(isString) })(received); // false

// Accepts both: the key may be missing or hold undefined.
const isPayload = struct({ id: isNumber, tag: optionalKey(optional(isString)) });
isPayload(payload); // true
isPayload(received); // true`;

export default function StructPage() {
  return (
    <Stack variant='main' className='container mx-auto px-4 py-10' gap='xl'>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h1'>struct</Heading>
          <Paragraph>
            Shape guard for objects; supports exact key checking and key-level
            optional fields via <code>optionalKey(...)</code>.
          </Paragraph>
          <Paragraph>
            Schema fields must be own enumerable string keys.{' '}
            <code>struct</code> rejects symbol-keyed, non-enumerable, and
            inherited fields so runtime validation matches its inferred type.
          </Paragraph>
        </Stack>
        <CodeBlock code={sample} language='ts' />
      </Stack>
      <Stack variant='section' gap='sm'>
        <Stack gap='xs'>
          <Heading variant='h2'>optional vs optionalKey</Heading>
          <Paragraph>
            <code>optional(guard)</code> is about the value: the key must be
            there, but it may hold <code>undefined</code>.{' '}
            <code>optionalKey(guard)</code> is about the key: it may be missing,
            but when it is there the value must pass the guard. Here is how each
            form treats <code>tag</code> in{' '}
            <code>{'struct({ id: isNumber, tag: ... })'}</code>.
          </Paragraph>
        </Stack>
        <GuideTable
          columns={[
            'Field schema',
            "{ id: 1, tag: 'hello' }",
            '{ id: 1, tag: undefined }',
            '{ id: 1 }',
            'Inferred tag'
          ]}
          rows={optionalityRows}
        />
        <Paragraph>
          If you come from a schema library where <code>.optional()</code>{' '}
          accepts both a missing key and <code>undefined</code>, the match is{' '}
          <code>optionalKey(optional(guard))</code>. See{' '}
          <TextLink href={API_REFERENCE_PATHS.nullish}>nullish</TextLink> for{' '}
          <code>optional</code> itself.
        </Paragraph>
      </Stack>
      <Stack variant='section' gap='sm'>
        <Stack gap='xs'>
          <Heading variant='h2'>API and JSON payloads</Heading>
          <Paragraph>
            The same data can reach a guard in both shapes. An object built from
            a maybe-undefined variable keeps the key even when the value is{' '}
            <code>undefined</code>. A JSON round trip removes that key. Use{' '}
            <code>optionalKey(optional(guard))</code> when a field has to pass
            in both cases.
          </Paragraph>
        </Stack>
        <CodeBlock code={payloadSample} language='ts' />
      </Stack>
      <ApiReferencePager currentHref={API_REFERENCE_PATHS.struct} />
    </Stack>
  );
}
