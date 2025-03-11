/**
 * Extracts the body tag and its contents from an HTML string
 * @param {string} htmlString - The HTML string to extract from
 * @returns {string[]} Array of extracted body contents
 */
export function extractBodyFromHTML(htmlString: string) {
  try {
    if (!htmlString) {
      console.log('Input HTML is null or undefined');
      return [];
    }

    // 安全な正規表現を使用してbodyタグを抽出
    // 非貪欲マッチングを使用し、ネストされたタグも考慮
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/gi;
    const matches = [];
    let match;

    while ((match = bodyRegex.exec(htmlString)) !== null) {
      if (match[1]) {
        matches.push(match[1].trim());
      }
    }

    if (matches.length === 0) {
      console.log('No body tags found');
      return [];
    }

    return matches;
  } catch (error) {
    console.error('An error occurred:', error);
    return [];
  }
}

/**
 * Extracts article tags and their contents from an HTML string
 * @param {string} htmlString - The HTML string to extract from
 * @returns {string[]} Array of extracted article contents
 */
export function extractArticleFromHTML(htmlString: string) {
  try {
    // 入力がnullまたはundefinedの場合は空配列を返す
    if (!htmlString) {
      console.log('Input HTML is null or undefined');
      return [];
    }
    
    const articles: string[] = [];
    
    // 1. まず、articleタグを探す - より限定的な正規表現に変更
    // 1つのarticleタグを処理する関数を作成
    const processArticleTags = () => {
      // articleタグのみに一致するように修正
      const articleRegex = /<article(?:\s+[^>]*)?>(.*?)<\/article>/gis;
      let articleMatch;
      let foundArticles = false;
      
      while ((articleMatch = articleRegex.exec(htmlString)) !== null) {
        if (articleMatch[1]) {
          articles.push(articleMatch[1].trim());
          foundArticles = true;
        }
      }
      
      return foundArticles;
    };
    
    // 2. main-contentを持つ要素を探す関数
    const processMainContent = () => {
      // タグを限定し、より具体的なパターンに修正
      const mainContentRegex = /<(div|section|main|article)(?:\s+[^>]*?)id=["']main-content["'](?:[^>]*?)>(.*?)<\/\1>/is;
      const mainContentMatch = mainContentRegex.exec(htmlString);
      
      if (mainContentMatch && mainContentMatch[2]) {
        console.log('Found element with main-content ID');
        
        // Content-articleクラスを持つdivタグを探す
        const contentArticleRegex = /<div(?:\s+[^>]*?)class=["'][^"']*Content-article[^"']*["'](?:[^>]*?)>(.*?)<\/div>/is;
        const contentArticleMatch = contentArticleRegex.exec(mainContentMatch[2]);
        
        if (contentArticleMatch && contentArticleMatch[1]) {
          console.log('Found content with Content-article class');
          articles.push(contentArticleMatch[1].trim());
          return true;
        } 
        
        // Documentクラスを持つdivタグを探す
        const documentRegex = /<div(?:\s+[^>]*?)class=["'][^"']*Document[^"']*["'](?:[^>]*?)>(.*?)<\/div>/is;
        const documentMatch = documentRegex.exec(mainContentMatch[2]);
        
        if (documentMatch && documentMatch[1]) {
          console.log('Found content with Document class');
          articles.push(documentMatch[1].trim());
          return true;
        }
        
        // main-content内の全コンテンツを使用
        console.log('Using all content within main-content');
        articles.push(mainContentMatch[2].trim());
        return true;
      }
      
      return false;
    };
    
    // 3. bodyタグ内のコンテンツを探す関数
    const processBody = () => {
      // bodyタグを探す - 限定的なパターン
      const bodyRegex = /<body(?:\s+[^>]*?)>(.*?)<\/body>/is;
      const bodyMatch = bodyRegex.exec(htmlString);
      
      if (bodyMatch && bodyMatch[1]) {
        // Content-articleクラスを持つdivタグを探す
        const contentArticleRegex = /<div(?:\s+[^>]*?)class=["'][^"']*Content-article[^"']*["'](?:[^>]*?)>(.*?)<\/div>/is;
        const contentArticleMatch = contentArticleRegex.exec(bodyMatch[1]);
        
        if (contentArticleMatch && contentArticleMatch[1]) {
          console.log('Found content with Content-article class in body');
          articles.push(contentArticleMatch[1].trim());
          return true;
        }
        
        // Documentクラスを持つdivタグを探す
        const documentRegex = /<div(?:\s+[^>]*?)class=["'][^"']*Document[^"']*["'](?:[^>]*?)>(.*?)<\/div>/is;
        const documentMatch = documentRegex.exec(bodyMatch[1]);
        
        if (documentMatch && documentMatch[1]) {
          console.log('Found content with Document class in body');
          articles.push(documentMatch[1].trim());
          return true;
        }
      }
      
      console.log('No specific content container found');
      return false;
    };
    
    // 順番に処理を試行
    if (!processArticleTags()) {
      console.log('No article tags found, trying to find main-content');
      if (!processMainContent()) {
        console.log('No main-content found, trying to find body content');
        processBody();
      }
    }
    
    return articles;
  } catch (error) {
    console.error('Error extracting article from HTML:', error);
    return [];
  }
}