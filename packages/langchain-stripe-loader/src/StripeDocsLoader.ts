import { SitemapProcessor } from 'stripe-loaders-core';
import { BaseDocumentLoader } from '@langchain/core/document_loaders/base';
import { Document } from '@langchain/core/documents';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { extractArticleFromHTML } from './utils';
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
 * Document loader for Stripe Docs website content
 * Extracts content from docs.stripe.com pages and converts it to LangChain documents
 */
export class StripeDocsDocumentLoader extends BaseDocumentLoader {
  constructor(private readonly debug: boolean = false) {
    super();
  }
  /**
   * Fetches URLs from the Stripe Docs sitemap
   * @returns {Promise<string[]>} Array of URLs from the sitemap
   */
  protected async fetchURLsFromSitemap() {
    const documentUrls = await new SitemapProcessor({
      debug: this.debug,
    }).fetchAndProcessSitemap('https://docs.stripe.com/sitemap.xml');
    return documentUrls;
  }

  /**
   * Fetches articles from the sitemap
   * @param {string} locale Locale for the content
   * @returns {Promise<StripeDocsArticle[]>} Array of article objects
   */
  private async fetchArticlesFromSitemap(locale: string): Promise<StripeDocsArticle[]> {
    const documentUrls = await this.fetchURLsFromSitemap();
    const arcitles: StripeDocsArticle[] = [];
    for await (const docsUrl of documentUrls) {
      const response = await fetch(`${docsUrl}?locale=${locale}`);
      const html = await response.text();
      const articles = extractArticleFromHTML(html);
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/);

      const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
      const description = descMatch ? descMatch[1].trim() : 'No description';
      arcitles.push(...articles.map(content => ({ url: docsUrl, content, title, description })));
    }
    return arcitles;
  }

  /**
   * Loads documents from Stripe Docs
   * @param {string} locale Locale for the content (defaults to 'en-US')
   * @returns {Promise<Document[]>} Array of LangChain documents
   */
  async load(locale: string = 'en-US'): Promise<Document[]> {
    const articles = await this.fetchArticlesFromSitemap(locale);
    
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
