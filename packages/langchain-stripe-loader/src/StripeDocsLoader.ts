import { SitemapProcessor } from 'stripe-loaders-core';
import { BaseDocumentLoader } from '@langchain/core/document_loaders/base';
import { Document } from '@langchain/core/documents';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { extractArticleFromHTML } from './utils';
import { filterUrls } from './utils/url-filter';
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
  private async fetchArticlesFromSitemap({
    locale,
    resource,
    excludeResources,
  }: {
    locale: string;
    resource?: string;
    excludeResources?: string[];
  }): Promise<StripeDocsArticle[]> {
    const documentUrls = await this.fetchURLsFromSitemap();
    const filteredDocumentUrls = filterUrls(documentUrls, resource, excludeResources);
    const articles = await this.fetchArticlesFromURLs(filteredDocumentUrls, locale);
    return articles;
  }

  private async fetchArticlesFromURLs(
    documentUrls: string[],
    locale: string
  ): Promise<StripeDocsArticle[]> {
    const arcitles: StripeDocsArticle[] = [];
    for await (const docsUrl of documentUrls) {
      try {
        console.log(`Fetching ${docsUrl}?locale=${locale}`);
        const response = await fetch(`${docsUrl}?locale=${locale}`);

        // Skip if HTTP status code is 400 or higher
        if (response.status >= 400) {
          console.log(`Skipping ${docsUrl} - HTTP status: ${response.status}`);
          continue;
        }

        const html = await response.text();
        const articles = extractArticleFromHTML(html);
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
        const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/);

        const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
        const description = descMatch ? descMatch[1].trim() : 'No description';
        arcitles.push(...articles.map(content => ({ url: docsUrl, content, title, description })));
      } catch (error) {
        console.error(`Error fetching ${docsUrl}: ${error}`);
        // Skip to the next URL if an error occurs
        continue;
      }
    }
    return arcitles;
  }

  /**
   * Loads documents from Stripe Docs
   * @param {string} locale Locale for the content (defaults to 'en-US')
   * @returns {Promise<Document[]>} Array of LangChain documents
   */
  async load(options?: {
    locale: string;
    urls?: string[];
    resource?: string;
    excludeResources?: string[];
  }): Promise<Document[]> {
    const { urls, resource, excludeResources } = options ?? {};
    const locale = options?.locale ?? 'en-US';
    const articles = urls
      ? await this.fetchArticlesFromURLs(urls, locale)
      : await this.fetchArticlesFromSitemap({ locale, resource, excludeResources });

    // Use NodeHtmlMarkdown to convert HTML to Markdown
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
