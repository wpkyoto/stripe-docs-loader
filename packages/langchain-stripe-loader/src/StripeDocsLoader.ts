import { fetchAndProcessSitemap } from 'stripe-loaders-core';
import { BaseDocumentLoader } from '@langchain/core/document_loaders/base';
import { Document } from '@langchain/core/documents';
import Turndown from 'turndown';
/**
 * 正規表現を使ってHTMLからarticleタグの内容を抽出する関数
 * @param {string} htmlString HTML文字列
 * @returns {string[]} 抽出されたarticleタグの内容の配列
 */
export function extractArticleFromHTML(htmlString: string) {
  try {
    // articleタグとその内容を抽出する正規表現
    // (?s) - ドットが改行にもマッチするようにする（sフラグ）
    // (?:<article[^>]*>) - articleタグの開始（属性も含む）
    // (.*?) - 非貪欲マッチングでタグの内容を取得
    // (?:</article>) - articleタグの終了
    const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/g;

    const articles = [];
    let match;

    // 全てのマッチを見つける
    while ((match = articleRegex.exec(htmlString)) !== null) {
      // マッチした内容（グループ1）を配列に追加
      articles.push(match[1].trim());
    }

    if (articles.length === 0) {
      console.log('articleタグが見つかりませんでした');
      return [];
    }

    return articles;
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

export class StripeDocsDocumentLoader extends BaseDocumentLoader {
  protected async fetchURLsFromSitemap() {
    const documentUrls = await fetchAndProcessSitemap('https://docs.stripe.com/sitemap.xml');
    return documentUrls;
  }
  private async fetchArticlesFromSitemap(locale: string): Promise<StripeDocsArticle[]> {
    const documentUrls = await this.fetchURLsFromSitemap();
    const arcitles: StripeDocsArticle[] = [];
    for await (const docsUrl of documentUrls) {
      const response = await fetch(`${docsUrl}?locale=${locale}`);
      const html = await response.text();
      const articles = extractArticleFromHTML(html);
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/);

      const title = titleMatch ? titleMatch[1].trim() : '不明';
      const description = descMatch ? descMatch[1].trim() : '説明なし';
      arcitles.push(...articles.map(content => ({ url: docsUrl, content, title, description })));
    }
    return arcitles;
  }
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
