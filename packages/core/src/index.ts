/**
 * Stripe docsのサイトマップ処理に関するユーティリティ関数
 */

/**
 * サイトマップからURLを抽出する関数
 * @param content サイトマップXMLの内容
 * @param baseUrl 抽出するURLの基本部分（例：https://docs.stripe.com/）
 * @returns 抽出されたURLの配列
 */
export function extractUrlsFromSitemap(
  content: string,
  baseUrl: string = 'https://docs.stripe.com/'
): string[] {
  const urlRegex = new RegExp(`<loc>(${baseUrl}[^<]+)<\/loc>`, 'g');
  const urls: string[] = [];
  let match;

  while ((match = urlRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * サイトマップインデックスからサイトマップURLを抽出する関数
 * @param content サイトマップインデックスXMLの内容
 * @returns 抽出されたサイトマップURLの配列
 */
export function extractSitemapUrlsFromIndex(content: string): string[] {
  // 入力チェック
  if (!content || typeof content !== 'string') {
    console.error('無効な入力: contentはstring型である必要があります');
    return [];
  }

  // 基本的なXML構造の検証
  if (!content.includes('<?xml') || !content.includes('<sitemapindex')) {
    console.error('Invalid sitemap index XML: Missing <?xml or <sitemapindex> elements.');
    return [];
  }

  try {
    const sitemapRegex = /<loc>([^<]+)<\/loc>/g;
    const sitemapUrls: string[] = [];
    let match;

    while ((match = sitemapRegex.exec(content)) !== null) {
      // URLの検証（オプション）
      const url = match[1];
      try {
        new URL(url); // URLが有効かチェック
        sitemapUrls.push(url);
      } catch (urlError) {
        console.warn(`無効なURL形式をスキップしました: ${url}`);
        // 無効なURLはスキップ
      }
    }

    if (sitemapUrls.length === 0) {
      console.warn('サイトマップインデックスから有効なURLが見つかりませんでした');
    }

    return sitemapUrls;
  } catch (error) {
    console.error('サイトマップインデックスからURLを抽出中にエラーが発生しました:', error);
    return []; // エラー時は空配列を返す
  }
}

/**
 * 新しく追加されたURLを検出する関数
 * @param currentUrls 現在のURLリスト
 * @param previousUrls 以前のURLリスト
 * @returns 新しく追加されたURLの配列
 */
export function findNewUrls(currentUrls: string[], previousUrls: string[]): string[] {
  const previousUrlSet = new Set(previousUrls);
  return currentUrls.filter(url => !previousUrlSet.has(url));
}

/**
 * サイトマップをフェッチして処理する関数
 * @param url サイトマップのURL
 * @param baseUrl 抽出するURLの基本部分
 * @returns 取得したURLリスト
 */
export async function fetchAndProcessSitemap(url: string, baseUrl?: string): Promise<string[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`サイトマップの取得に失敗しました: ${response.status} ${response.statusText}`);
  }

  const sitemapContent = await response.text();
  return extractUrlsFromSitemap(sitemapContent, baseUrl);
}

/**
 * サイトマップインデックスをフェッチして処理する関数
 * @param indexUrl サイトマップインデックスのURL
 * @param baseUrl 抽出するURLの基本部分
 * @returns 取得したURLリスト
 */
export async function fetchAndProcessSitemapIndex(
  indexUrl: string,
  baseUrl?: string
): Promise<string[]> {
  console.log(`サイトマップインデックスをフェッチします: ${indexUrl}`);
  const response = await fetch(indexUrl);

  if (!response.ok) {
    throw new Error(
      `サイトマップインデックスの取得に失敗しました: ${response.status} ${response.statusText}`
    );
  }

  const indexContent = await response.text();
  const sitemapUrls = extractSitemapUrlsFromIndex(indexContent);
  console.log(`サイトマップパーティション数: ${sitemapUrls.length}`);

  // 各サイトマップファイルからURLを取得して結合
  const allUrls: string[] = [];

  for (let i = 0; i < sitemapUrls.length; i++) {
    const sitemapUrl = sitemapUrls[i];
    console.log(`パーティション ${i + 1}/${sitemapUrls.length} を処理中: ${sitemapUrl}`);
    const urls = await fetchAndProcessSitemap(sitemapUrl, baseUrl);
    console.log(`パーティション ${i + 1} から ${urls.length} 個のURLを取得しました`);
    allUrls.push(...urls);
  }

  return allUrls;
}
