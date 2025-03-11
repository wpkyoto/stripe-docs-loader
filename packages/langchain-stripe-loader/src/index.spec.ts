import { it, expect } from 'vitest';
import { StripeComDocumentLoader } from './index';

it('silence is golden', () => {
  expect(true).toBe(true);
});

it('test', {
	timeout: 10000,
},async () => {
	
  const loader = new StripeComDocumentLoader();
  const documents = await loader.load({
	resource: 'blog'
  });
  expect(documents).toStrictEqual([]);
});
