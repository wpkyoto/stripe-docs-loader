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

    // Use safe regular expression to extract body tags
    // Use non-greedy matching and consider nested tags
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
    // Return empty array if input is null or undefined
    if (!htmlString) {
      console.log('Input HTML is null or undefined');
      return [];
    }

    const articles: string[] = [];

    // 1. First, look for article tags - changed to more specific regex
    // Create a function to process one article tag
    const processArticleTags = () => {
      // Modified to match only article tags
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

    // 2. Function to find elements with main-content
    const processMainContent = () => {
      // Limited to specific tags and more specific pattern
      const mainContentRegex =
        /<(div|section|main|article)(?:\s+[^>]*?)id=["']main-content["'](?:[^>]*?)>(.*?)<\/\1>/is;
      const mainContentMatch = mainContentRegex.exec(htmlString);

      if (mainContentMatch && mainContentMatch[2]) {
        console.log('Found element with main-content ID');

        // Look for div tags with Content-article class
        const contentArticleRegex =
          /<div(?:\s+[^>]*?)class=["'][^"']*Content-article[^"']*["'](?:[^>]*?)>(.*?)<\/div>/is;
        const contentArticleMatch = contentArticleRegex.exec(mainContentMatch[2]);

        if (contentArticleMatch && contentArticleMatch[1]) {
          console.log('Found content with Content-article class');
          articles.push(contentArticleMatch[1].trim());
          return true;
        }

        // Look for div tags with Document class
        const documentRegex =
          /<div(?:\s+[^>]*?)class=["'][^"']*Document[^"']*["'](?:[^>]*?)>(.*?)<\/div>/is;
        const documentMatch = documentRegex.exec(mainContentMatch[2]);

        if (documentMatch && documentMatch[1]) {
          console.log('Found content with Document class');
          articles.push(documentMatch[1].trim());
          return true;
        }

        // Use all content within main-content
        console.log('Using all content within main-content');
        articles.push(mainContentMatch[2].trim());
        return true;
      }

      return false;
    };

    // 3. Function to find content in body tag
    const processBody = () => {
      // Look for body tag - specific pattern
      const bodyRegex = /<body(?:\s+[^>]*?)>(.*?)<\/body>/is;
      const bodyMatch = bodyRegex.exec(htmlString);

      if (bodyMatch && bodyMatch[1]) {
        // Look for div tags with Content-article class
        const contentArticleRegex =
          /<div(?:\s+[^>]*?)class=["'][^"']*Content-article[^"']*["'](?:[^>]*?)>(.*?)<\/div>/is;
        const contentArticleMatch = contentArticleRegex.exec(bodyMatch[1]);

        if (contentArticleMatch && contentArticleMatch[1]) {
          console.log('Found content with Content-article class in body');
          articles.push(contentArticleMatch[1].trim());
          return true;
        }

        // Look for div tags with Document class
        const documentRegex =
          /<div(?:\s+[^>]*?)class=["'][^"']*Document[^"']*["'](?:[^>]*?)>(.*?)<\/div>/is;
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

    // Try processing in sequence
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
