import { fetchAndProcessSitemap } from 'stripe-loaders-core';
import { BaseDocumentLoader } from '@langchain/core/document_loaders/base';
import { Document } from '@langchain/core/documents';
import Turndown from 'turndown';
/**
 * Function that extracts the content of article tags from HTML using regular expressions
 * @param {string} htmlString HTML string
 * @returns {string[]} Array of extracted article tag contents
 */
export function extractArticleFromHTML(htmlString: string) {
  try {
    // Regular expression to extract article tag and its contents
    // [\s\S]*? - Non-greedy match for any characters including newlines
    const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/g;

    const articles = [];
    let match;

    // Find all matches
    while ((match = articleRegex.exec(htmlString)) !== null) {
      // Add matched content (group 1) to the array
      articles.push(match[1].trim());
    }

    if (articles.length === 0) {
      console.log('No article tags found');
      return [];
    }

    return articles;
  } catch (error) {
    console.error('An error occurred:', error);
    return [];
  }
}

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
  /**
   * Fetches URLs from the Stripe Docs sitemap
   * @returns {Promise<string[]>} Array of URLs from the sitemap
   */
  protected async fetchURLsFromSitemap() {
    const documentUrls = await fetchAndProcessSitemap('https://docs.stripe.com/sitemap.xml');
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
    const encoder = new Turndown();
    const documents = articles.map(article => {
      const markdownContent = encoder.turndown(article.content);
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
