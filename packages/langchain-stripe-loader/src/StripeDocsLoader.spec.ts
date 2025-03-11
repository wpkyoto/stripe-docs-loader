import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StripeDocsDocumentLoader } from './StripeDocsLoader';
import * as urlFilter from './utils/url-filter';

// モックの作成
vi.mock('stripe-loaders-core', () => ({
  SitemapProcessor: vi.fn().mockImplementation(() => ({
    fetchAndProcessSitemap: vi
      .fn()
      .mockResolvedValue([
        'https://docs.stripe.com/connect/accounts',
        'https://docs.stripe.com/docs/connect',
        'https://docs.stripe.com/billing',
        'https://docs.stripe.com/get-started/account',
      ]),
  })),
}));

vi.mock('./utils', () => ({
  extractArticleFromHTML: vi.fn().mockReturnValue(['<p>Test content</p>']),
}));

// fetchのモック
global.fetch = vi.fn().mockImplementation(url =>
  Promise.resolve({
    status: 200,
    text: () =>
      Promise.resolve(`
      <html>
        <head>
          <title>Test Page</title>
          <meta name="description" content="Test description">
        </head>
        <body>
          <article>Test content</article>
        </body>
      </html>
    `),
  })
);

describe('StripeDocsDocumentLoader', () => {
  let loader: StripeDocsDocumentLoader;

  beforeEach(() => {
    vi.clearAllMocks();
    loader = new StripeDocsDocumentLoader();
  });

  describe('fetchArticlesFromSitemap', () => {
    it('filterUrls関数を正しく呼び出す', async () => {
      // filterUrls関数のスパイを作成
      const filterUrlsSpy = vi.spyOn(urlFilter, 'filterUrls');

      // プライベートメソッドを呼び出すためにanyにキャスト
      await (loader as any).fetchArticlesFromSitemap({
        locale: 'ja',
        resource: 'connect',
        excludeResources: ['billing'],
      });

      // filterUrls関数が正しいパラメータで呼び出されたことを確認
      expect(filterUrlsSpy).toHaveBeenCalledWith(
        [
          'https://docs.stripe.com/connect/accounts',
          'https://docs.stripe.com/docs/connect',
          'https://docs.stripe.com/billing',
          'https://docs.stripe.com/get-started/account',
        ],
        'connect',
        ['billing']
      );
    });
  });

  describe('load', () => {
    it('リソースとロケールを指定してドキュメントを読み込む', async () => {
      const documents = await loader.load({
        locale: 'ja',
        resource: 'connect',
      });

      // 結果の検証
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0].metadata.source).toBeDefined();
      expect(documents[0].metadata.title).toBe('Test Page');
      expect(documents[0].metadata.description).toBe('Test description');
    });

    it('URLを直接指定してドキュメントを読み込む', async () => {
      const documents = await loader.load({
        locale: 'ja',
        urls: ['https://docs.stripe.com/custom/url'],
      });

      // 結果の検証
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0].metadata.source).toBe('https://docs.stripe.com/custom/url');
    });
  });
});
