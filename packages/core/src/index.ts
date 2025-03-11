/**
 * Utility functions for processing Stripe docs sitemaps
 */

/**
 * Logger interface for SitemapProcessor
 */
export interface Logger {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

/**
 * Default console logger implementation
 */
export class ConsoleLogger implements Logger {
  constructor(private debug: boolean = false) {}

  log(message: string): void {
    if (this.debug) {
      console.log(message);
    }
  }

  error(message: string): void {
    console.error(message);
  }

  warn(message: string): void {
    if (this.debug) {
      console.warn(message);
    }
  }
}

/**
 * Utility class for processing Stripe docs sitemaps
 */
export class SitemapProcessor {
  private debug: boolean;
  private logger: Logger;

  /**
   * Constructor for SitemapProcessor
   * @param options Configuration options
   */
  constructor(options: { debug?: boolean; logger?: Logger } = {}) {
    this.debug = options.debug ?? false;
    this.logger = options.logger ?? new ConsoleLogger(this.debug);
  }

  /**
   * Log a message if debug mode is enabled
   * @param message Message to log
   */
  private log(message: string): void {
    this.logger.log(message);
  }

  /**
   * Log an error message
   * @param message Error message to log
   */
  private logError(message: string): void {
    this.logger.error(message);
  }

  /**
   * Log a warning message
   * @param message Warning message to log
   */
  private logWarning(message: string): void {
    this.logger.warn(message);
  }

  /**
   * Extract URLs from a sitemap
   * @param content Sitemap XML content
   * @param baseUrl Base URL part to extract (e.g., https://docs.stripe.com/)
   * @returns Array of extracted URLs
   */
  public extractUrlsFromSitemap(
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
   * Extract sitemap URLs from a sitemap index
   * @param content Sitemap index XML content
   * @returns Array of extracted sitemap URLs
   */
  public extractSitemapUrlsFromIndex(content: string): string[] {
    // Input validation
    if (!content || typeof content !== 'string') {
      this.logError('Invalid input: content must be a string');
      return [];
    }

    // Basic XML structure validation
    if (!content.includes('<?xml') || !content.includes('<sitemapindex')) {
      this.logError('Invalid sitemap index XML: Missing <?xml or <sitemapindex> elements.');
      return [];
    }

    try {
      const sitemapRegex = /<loc>([^<]+)<\/loc>/g;
      const sitemapUrls: string[] = [];
      let match;

      while ((match = sitemapRegex.exec(content)) !== null) {
        // URL validation (optional)
        const url = match[1];
        try {
          new URL(url); // Check if URL is valid
          sitemapUrls.push(url);
        } catch (urlError) {
          this.logWarning(`Skipped invalid URL format: ${url}`);
          // Skip invalid URLs
        }
      }

      if (sitemapUrls.length === 0) {
        this.logWarning('No valid URLs found in sitemap index');
      }

      return sitemapUrls;
    } catch (error) {
      this.logError(`Error extracting URLs from sitemap index: ${error}`);
      return []; // Return empty array on error
    }
  }

  /**
   * Find newly added URLs
   * @param currentUrls Current URL list
   * @param previousUrls Previous URL list
   * @returns Array of newly added URLs
   */
  public findNewUrls(currentUrls: string[], previousUrls: string[]): string[] {
    const previousUrlSet = new Set(previousUrls);
    return currentUrls.filter(url => !previousUrlSet.has(url));
  }

  /**
   * Fetch and process a sitemap
   * @param url Sitemap URL
   * @param baseUrl Base URL part to extract
   * @returns List of retrieved URLs
   */
  public async fetchAndProcessSitemap(url: string, baseUrl?: string): Promise<string[]> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
    }

    const sitemapContent = await response.text();
    return this.extractUrlsFromSitemap(sitemapContent, baseUrl);
  }

  /**
   * Fetch and process a sitemap index
   * @param indexUrl Sitemap index URL
   * @param baseUrl Base URL part to extract
   * @returns List of retrieved URLs
   */
  public async fetchAndProcessSitemapIndex(
    indexUrl: string,
    baseUrl?: string
  ): Promise<string[]> {
    this.log(`Fetching sitemap index: ${indexUrl}`);
    const response = await fetch(indexUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch sitemap index: ${response.status} ${response.statusText}`
      );
    }

    const indexContent = await response.text();
    const sitemapUrls = this.extractSitemapUrlsFromIndex(indexContent);
    this.log(`Number of sitemap partitions: ${sitemapUrls.length}`);

    // Combine URLs from each sitemap file
    const allUrls: string[] = [];

    for (let i = 0; i < sitemapUrls.length; i++) {
      const sitemapUrl = sitemapUrls[i];
      this.log(`Processing partition ${i + 1}/${sitemapUrls.length}: ${sitemapUrl}`);
      const urls = await this.fetchAndProcessSitemap(sitemapUrl, baseUrl);
      this.log(`Retrieved ${urls.length} URLs from partition ${i + 1}`);
      allUrls.push(...urls);
    }

    return allUrls;
  }
}
