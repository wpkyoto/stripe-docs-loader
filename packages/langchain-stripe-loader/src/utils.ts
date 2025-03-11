/**
 * Function that extracts the content of body tags from HTML using regular expressions
 * @param {string} htmlString HTML string
 * @returns {string[]} Array of extracted body tag contents
 */
export function extractBodyFromHTML(htmlString: string) {
  try {
    // Regular expression to extract body tag and its contents
    // [\s\S]*? - Non-greedy match for any characters including newlines
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/g;

    const bodies = [];
    let match;

    // Find all matches
    while ((match = bodyRegex.exec(htmlString)) !== null) {
      // Add matched content (group 1) to the array
      bodies.push(match[1].trim());
    }

    if (bodies.length === 0) {
      console.log('No body tags found');
      return [];
    }

    return bodies;
  } catch (error) {
    console.error('An error occurred:', error);
    return [];
  }
}
/**
 * Function that extracts the content of article tags from HTML using regular expressions
 * @param {string} htmlString HTML string
 * @returns {string[]} Array of extracted article tag contents
 */
export function extractArticleFromHTML(htmlString: string) {
  try {
    // 入力がnullまたはundefinedの場合は空配列を返す
    if (!htmlString) {
      console.log('Input HTML is null or undefined');
      return [];
    }
    
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

    // If no article tags found, try to find content by main-content ID
    if (articles.length === 0) {
      console.log('No article tags found, trying to find main-content');
      
      // より柔軟な方法でコンテンツを抽出
      // 1. まず、main-contentを含む要素を探す
      const mainContentMatch = htmlString.match(/<[^>]*id=["']main-content["'][^>]*>([\s\S]*?)<\/[^>]*>/i);
      
      if (mainContentMatch && mainContentMatch[1]) {
        console.log('Found element with main-content ID');
        
        // 2. Content-articleクラスを持つ要素を探す
        const contentArticleMatch = mainContentMatch[1].match(/<div[^>]*class=["'][^"']*Content-article[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
        
        if (contentArticleMatch && contentArticleMatch[1]) {
          console.log('Found content with Content-article class');
          articles.push(contentArticleMatch[1].trim());
        } else {
          // 3. Document要素を探す
          const documentMatch = mainContentMatch[1].match(/<div[^>]*class=["'][^"']*Document[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
          
          if (documentMatch && documentMatch[1]) {
            console.log('Found content with Document class');
            articles.push(documentMatch[1].trim());
          } else {
            // 4. main-content内の全コンテンツを使用
            console.log('Using all content within main-content');
            articles.push(mainContentMatch[1].trim());
          }
        }
      } else {
        // main-contentが見つからない場合、bodyタグ内のコンテンツを探す
        console.log('No main-content found, trying to find body content');
        const bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        
        if (bodyMatch && bodyMatch[1]) {
          // Content-articleクラスを持つ要素を探す
          const contentArticleMatch = bodyMatch[1].match(/<div[^>]*class=["'][^"']*Content-article[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
          
          if (contentArticleMatch && contentArticleMatch[1]) {
            console.log('Found content with Content-article class in body');
            articles.push(contentArticleMatch[1].trim());
          } else {
            // Documentクラスを持つ要素を探す
            const documentMatch = bodyMatch[1].match(/<div[^>]*class=["'][^"']*Document[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
            
            if (documentMatch && documentMatch[1]) {
              console.log('Found content with Document class in body');
              articles.push(documentMatch[1].trim());
            } else {
              console.log('No specific content container found');
            }
          }
        } else {
          console.log('No body content found');
        }
      }
    }

    if (articles.length === 0) {
      console.log('No content found in the HTML');
      return [];
    }

    return articles;
  } catch (error) {
    console.error('An error occurred:', error);
    return [];
  }
}
