import { describe, it, expect } from 'vitest';
import { SitemapProcessor } from './index';

describe('sitemap-utils', () => {
  describe('extractUrlsFromSitemap', () => {
    it('空のXMLからは空の配列を返す', () => {
      const emptyXml = '';
      expect(new SitemapProcessor().extractUrlsFromSitemap(emptyXml)).toEqual([]);
    });

    it('URLがないXMLからは空の配列を返す', () => {
      const xmlWithoutUrls = '<url></url>';
      expect(new SitemapProcessor().extractUrlsFromSitemap(xmlWithoutUrls)).toEqual([]);
    });

    it('正しいXMLから適切にURLを抽出する', () => {
      const xml = `
        <urlset>
          <url>
            <loc>https://docs.stripe.com/page1</loc>
          </url>
          <url>
            <loc>https://docs.stripe.com/page2</loc>
          </url>
          <url>
            <loc>https://docs.stripe.com/page3</loc>
          </url>
        </urlset>
      `;

      const expected = [
        'https://docs.stripe.com/page1',
        'https://docs.stripe.com/page2',
        'https://docs.stripe.com/page3',
      ];

      expect(new SitemapProcessor().extractUrlsFromSitemap(xml)).toEqual(expected);
    });
  });

  describe('findNewUrls', () => {
    it('現在のURLリストが空の場合は空の配列を返す', () => {
      const currentUrls: string[] = [];
      const previousUrls = ['https://docs.stripe.com/page1'];

      expect(new SitemapProcessor().findNewUrls(currentUrls, previousUrls)).toEqual([]);
    });

    it('以前のURLリストが空の場合は現在のURLリスト全てを返す', () => {
      const currentUrls = ['https://docs.stripe.com/page1', 'https://docs.stripe.com/page2'];
      const previousUrls: string[] = [];

      expect(new SitemapProcessor().findNewUrls(currentUrls, previousUrls)).toEqual(currentUrls);
    });

    it('新しく追加されたURLのみを返す', () => {
      const currentUrls = [
        'https://docs.stripe.com/page1',
        'https://docs.stripe.com/page2',
        'https://docs.stripe.com/page3',
        'https://docs.stripe.com/page4',
      ];

      const previousUrls = ['https://docs.stripe.com/page1', 'https://docs.stripe.com/page2'];

      const expected = ['https://docs.stripe.com/page3', 'https://docs.stripe.com/page4'];

      expect(new SitemapProcessor().findNewUrls(currentUrls, previousUrls)).toEqual(expected);
    });
  });
});
