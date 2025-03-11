import { it, expect, vi, describe } from 'vitest';
import { StripeComDocumentLoader, StripeDocsDocumentLoader } from './index';
import { SitemapProcessor } from 'stripe-loaders-core';

// SitemapProcessorをモック
vi.mock('stripe-loaders-core', () => {
  return {
    SitemapProcessor: vi.fn().mockImplementation(() => {
      return {
        fetchAndProcessSitemap: vi.fn().mockResolvedValue(['https://docs.stripe.com/test']),
      };
    }),
  };
});

it('silence is golden', () => {
  expect(true).toBe(true);
});

/**
 * Just for local development
 */
it.skip(
  'test for StripeComDocumentLoader',
  {
    timeout: 10000,
  },
  async () => {
    const loader = new StripeComDocumentLoader();
    const documents = await loader.load({
      resource: 'blog',
    });
    expect(documents).toStrictEqual([]);
  }
);

describe('StripeDocsDocumentLoader', () => {
  it(
    'should load documents successfully',
    {
      timeout: 10000,
    },
    async () => {
      // fetchのモック
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        text: vi.fn().mockResolvedValue(`
          <html>
            <head>
              <title>Test Title</title>
              <meta name="description" content="Test Description">
            </head>
            <body>
              <div id="main-content">
                <div class="Content-article">
                  <h1>Test Content</h1>
                  <p>This is test content for the Stripe docs.</p>
                </div>
              </div>
            </body>
          </html>
        `),
      });

      const loader = new StripeDocsDocumentLoader();
      const documents = await loader.load();

      // 期待する結果
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0].pageContent).toContain('Test Content');
      expect(documents[0].metadata.title).toBe('Test Title');
      expect(documents[0].metadata.description).toBe('Test Description');
      expect(documents[0].metadata.source).toBe('https://docs.stripe.com/test');
    }
  );

  it(
    'should skip pages with HTTP 404 status',
    {
      timeout: 10000,
    },
    async () => {
      // SitemapProcessorのモックを上書き
      (SitemapProcessor as any).mockImplementation(() => {
        return {
          fetchAndProcessSitemap: vi
            .fn()
            .mockResolvedValue([
              'https://docs.stripe.com/valid-page',
              'https://docs.stripe.com/not-found-page',
            ]),
        };
      });

      // fetchのモック - 最初のURLは成功、2番目のURLは404
      global.fetch = vi
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            text: () =>
              Promise.resolve(`
            <html>
              <head>
                <title>Valid Page</title>
                <meta name="description" content="Valid Description">
              </head>
              <body>
                <div id="main-content">
                  <div class="Content-article">
                    <h1>Valid Content</h1>
                    <p>This is valid content.</p>
                  </div>
                </div>
              </body>
            </html>
          `),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 404,
            text: () =>
              Promise.resolve(`
            <html>
              <head>
                <title>404 Not Found</title>
              </head>
              <body>
                <h1>404 Not Found</h1>
              </body>
            </html>
          `),
          })
        );

      const loader = new StripeDocsDocumentLoader();
      const documents = await loader.load();

      // 404ページはスキップされるため、有効なページからのドキュメントのみが含まれる
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0].pageContent).toContain('Valid Content');
      expect(documents[0].metadata.title).toBe('Valid Page');
      expect(documents[0].metadata.source).toBe('https://docs.stripe.com/valid-page');

      // fetchが2回呼ばれたことを確認
      expect(global.fetch).toHaveBeenCalledTimes(2);
    }
  );
});
