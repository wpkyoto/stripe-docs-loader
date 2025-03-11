import { fetchAndProcessSitemap, fetchAndProcessSitemapIndex } from 'stripe-loaders-core';

/**
 * LangChainのStripeドキュメントローダー
 * Stripeのドキュメントサイトからコンテンツを取得するためのユーティリティ
 */
export class StripeDocsLoader {
  private baseUrl: string;
  
  /**
   * @param baseUrl Stripeドキュメントの基本URL
   */
  constructor(baseUrl: string = 'https://docs.stripe.com/') {
    this.baseUrl = baseUrl;
  }

  /**
   * サイトマップからURLを取得する
   * @param sitemapUrl サイトマップのURL
   * @returns 取得したURLの配列
   */
  async loadFromSitemap(sitemapUrl: string): Promise<string[]> {
    return await fetchAndProcessSitemap(sitemapUrl, this.baseUrl);
  }

  /**
   * サイトマップインデックスからURLを取得する
   * @param indexUrl サイトマップインデックスのURL
   * @returns 取得したURLの配列
   */
  async loadFromSitemapIndex(indexUrl: string): Promise<string[]> {
    return await fetchAndProcessSitemapIndex(indexUrl, this.baseUrl);
  }
}
