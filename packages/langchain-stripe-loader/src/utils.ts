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
