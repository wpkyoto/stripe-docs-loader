import { fetchAndProcessSitemapIndex } from 'stripe-loaders-core';
import { BaseDocumentLoader } from '@langchain/core/document_loaders/base';
import { Document } from '@langchain/core/documents';
import Turndown from 'turndown';
/**
 * 正規表現を使ってHTMLからarticleタグの内容を抽出する関数
 * @param {string} htmlString HTML文字列
 * @returns {string[]} 抽出されたarticleタグの内容の配列
 */
export function extractBodyFromHTML(htmlString: string) {
  try {
    // articleタグとその内容を抽出する正規表現
    // (?s) - ドットが改行にもマッチするようにする（sフラグ）
    // (?:<article[^>]*>) - articleタグの開始（属性も含む）
    // (.*?) - 非貪欲マッチングでタグの内容を取得
    // (?:</article>) - articleタグの終了
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/g;

    const bodies = [];
    let match;

    // 全てのマッチを見つける
    while ((match = bodyRegex.exec(htmlString)) !== null) {
      // マッチした内容（グループ1）を配列に追加
      bodies.push(match[1].trim());
    }

    if (bodies.length === 0) {
      console.log('bodyタグが見つかりませんでした');
      return [];
    }

    return bodies;
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return [];
  }
}

type StripeDocsArticle = {
  url: string;
  content: string;
  title: string;
  description: string;
};

export class StripeComDocumentLoader extends BaseDocumentLoader {
  protected async fetchURLsFromSitemap(resource?: string) {
    const documentUrls = await fetchAndProcessSitemapIndex(
        'https://stripe.com/sitemap/sitemap.xml',
        ['https://stripe.com/', resource].filter(Boolean).join('')
    );;
    return [documentUrls[0], documentUrls[1]];
  }
  private async fetchArticlesFromURLs(urls: string[], locale?: string): Promise<StripeDocsArticle[]> {
    const articles: StripeDocsArticle[] = [];
    for await (const docsUrl of urls) {
      const response = await fetch(`${docsUrl}?locale=${locale}`);
      const html = await response.text();
      const rawArticles = extractBodyFromHTML(html);
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/);

      const title = titleMatch ? titleMatch[1].trim() : '不明';
      const description = descMatch ? descMatch[1].trim() : '説明なし';
      articles.push(...rawArticles.map(content => ({ url: docsUrl, content, title, description })));
    }
    return articles;
  }
  private async fetchArticlesFromSitemap(resource?: string, locale?: string): Promise<StripeDocsArticle[]> {
    const documentUrls = await this.fetchURLsFromSitemap(resource);
    const articles = await this.fetchArticlesFromURLs(documentUrls, locale);
    return articles;
  }
  async load(options?:{resource?: string, locale?: string; urls?: string[]}): Promise<Document[]> {
    const {resource, urls} = options ?? {};
    const locale = options?.locale ?? 'en-US';
    const articles = urls ? await this.fetchArticlesFromURLs(urls, locale) : await this.fetchArticlesFromSitemap(resource, locale);
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
