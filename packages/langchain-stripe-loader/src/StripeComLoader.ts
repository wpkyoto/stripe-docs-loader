import { SitemapProcessor } from 'stripe-loaders-core';
import { BaseDocumentLoader } from '@langchain/core/document_loaders/base';
import { Document } from '@langchain/core/documents';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { extractBodyFromHTML } from './utils';

/**
 * Interface representing a Stripe documentation article
 */
type StripeDocsArticle = {
  url: string;
  content: string;
  title: string;
  description: string;
};

/**
 * Document loader for Stripe.com website content
 * Extracts content from Stripe.com pages and converts it to LangChain documents
 */
export class StripeComDocumentLoader extends BaseDocumentLoader {
  constructor(private readonly debug: boolean = false) {
    super();
  }
  /**
   * Fetches URLs from the Stripe.com sitemap
   * @param {string} resource Optional resource path to filter URLs
   * @returns {Promise<string[]>} Array of URLs from the sitemap
   */
  protected async fetchURLsFromSitemap(resource?: string) {
    const documentUrls = await new SitemapProcessor({
      debug: this.debug,
    }).fetchAndProcessSitemapIndex(
      'https://stripe.com/sitemap/sitemap.xml',
      ['https://stripe.com/', resource].filter(Boolean).join('')
    );
    return [documentUrls[0], documentUrls[1]];
  }

  /**
   * Fetches article content from a list of URLs
   * @param {string[]} urls Array of URLs to fetch content from
   * @param {string} locale Optional locale for the content
   * @returns {Promise<StripeDocsArticle[]>} Array of article objects
   */
  private async fetchArticlesFromURLs(
    urls: string[],
    locale?: string
  ): Promise<StripeDocsArticle[]> {
    const articles: StripeDocsArticle[] = [];
    for await (const docsUrl of urls) {
      const response = await fetch(`${docsUrl}?locale=${locale}`);
      const html = await response.text();
      const rawArticles = extractBodyFromHTML(html);
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/);

      const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
      const description = descMatch ? descMatch[1].trim() : 'No description';
      articles.push(...rawArticles.map(content => ({ url: docsUrl, content, title, description })));
    }
    return articles;
  }

  /**
   * Fetches articles from the sitemap
   * @param {string} resource Optional resource path to filter URLs
   * @param {string} locale Optional locale for the content
   * @returns {Promise<StripeDocsArticle[]>} Array of article objects
   */
  private async fetchArticlesFromSitemap(
    resource?: string,
    locale?: string
  ): Promise<StripeDocsArticle[]> {
    const documentUrls = await this.fetchURLsFromSitemap(resource);
    const articles = await this.fetchArticlesFromURLs(documentUrls, locale);
    return articles;
  }

  /**
   * Loads documents from Stripe.com
   * @param {Object} options Loading options
   * @param {string} options.resource Optional resource path to filter URLs
   * @param {string} options.locale Optional locale for the content (defaults to 'en-US')
   * @param {string[]} options.urls Optional list of specific URLs to load
   * @returns {Promise<Document[]>} Array of LangChain documents
   */
  async load(options?: {
    resource?: string;
    locale?: string;
    urls?: string[];
  }): Promise<Document[]> {
    const { resource, urls } = options ?? {};
    const locale = options?.locale ?? 'en-US';
    const articles = urls
      ? await this.fetchArticlesFromURLs(urls, locale)
      : await this.fetchArticlesFromSitemap(resource, locale);
    
    // NodeHtmlMarkdownを使用してHTMLをMarkdownに変換
    const nhm = new NodeHtmlMarkdown();
    
    const documents = articles.map(article => {
      const markdownContent = nhm.translate(article.content);
      return new Document({
        pageContent: markdownContent,
        metadata: {
          source: article.url,
          title: article.title,
          description: article.description,
        },
      });
    });
    return documents;
  }
}
