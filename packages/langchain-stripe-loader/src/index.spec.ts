import { it, expect } from 'vitest';
import { StripeDocsDocumentLoader } from './index';

it('silence is golden', () => {
  expect(true).toBe(true);
});

it('test', async () => {
  const loader = new StripeDocsDocumentLoader();
  const documents = await loader.load();
  expect(documents).toStrictEqual([]);
});
