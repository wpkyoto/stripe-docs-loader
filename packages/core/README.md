# Stripe Docs Sitemap Processor

A utility library for processing Stripe documentation sitemaps. This library helps you fetch, parse, and process sitemaps from Stripe's documentation site.

## Features

- Extract URLs from Stripe documentation sitemaps
- Process sitemap index files to get all URLs from multiple sitemaps
- Find newly added URLs by comparing current and previous URL lists
- Configurable logging with custom logger support
- Debug mode for detailed logging

## Installation

```bash
npm install stripe-loader-core
```

## Usage

### Basic Usage

```typescript
import { SitemapProcessor } from 'stripe-loader-core';

// Create a processor instance
const processor = new SitemapProcessor();

// Fetch and process a sitemap index
async function fetchAllDocs() {
  try {
    const urls = await processor.fetchAndProcessSitemapIndex('https://docs.stripe.com/sitemap.xml');
    console.log(`Found ${urls.length} URLs in the Stripe documentation`);
    return urls;
  } catch (error) {
    console.error('Error processing sitemap:', error);
    return [];
  }
}

// Find new URLs
function findNewContent(currentUrls, previousUrls) {
  const newUrls = processor.findNewUrls(currentUrls, previousUrls);
  console.log(`Found ${newUrls.length} new URLs`);
  return newUrls;
}
```

### With Debug Mode

Enable debug mode to see detailed logs during processing:

```typescript
// Create a processor with debug mode enabled
const processor = new SitemapProcessor({ debug: true });

// Now all processing will output detailed logs
const urls = await processor.fetchAndProcessSitemapIndex('https://docs.stripe.com/sitemap.xml');
```

### Custom Logger

You can provide your own logger implementation:

```typescript
import { SitemapProcessor, Logger } from '@stripe-loaders/core';

// Implement your own logger
class MyCustomLogger implements Logger {
  log(message: string): void {
    // Custom log implementation
    myLoggingService.info(message);
  }

  error(message: string): void {
    // Custom error implementation
    myLoggingService.error(message);
  }

  warn(message: string): void {
    // Custom warning implementation
    myLoggingService.warn(message);
  }
}

// Create a processor with custom logger
const processor = new SitemapProcessor({
  logger: new MyCustomLogger(),
});
```

### Processing Individual Sitemaps

If you need to process a specific sitemap file:

```typescript
// Process a single sitemap file
const urls = await processor.fetchAndProcessSitemap('https://docs.stripe.com/sitemap-api.xml');
console.log(`Found ${urls.length} API documentation URLs`);
```

### Extracting URLs from Sitemap Content

If you already have the sitemap content:

```typescript
// Extract URLs from sitemap content
const sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>...'; // XML content
const urls = processor.extractUrlsFromSitemap(sitemapContent);

// Extract sitemap URLs from a sitemap index
const indexContent = '<?xml version="1.0" encoding="UTF-8"?>...'; // XML content
const sitemapUrls = processor.extractSitemapUrlsFromIndex(indexContent);
```

## API Reference

### SitemapProcessor

The main class for processing sitemaps.

#### Constructor

```typescript
constructor(options: { debug?: boolean; logger?: Logger } = {})
```

- `options.debug`: Enable debug mode (default: false)
- `options.logger`: Custom logger implementation (default: ConsoleLogger)

#### Methods

- `extractUrlsFromSitemap(content: string, baseUrl?: string): string[]`

  - Extract URLs from sitemap XML content
  - `baseUrl` defaults to 'https://docs.stripe.com/'

- `extractSitemapUrlsFromIndex(content: string): string[]`

  - Extract sitemap URLs from a sitemap index XML content

- `findNewUrls(currentUrls: string[], previousUrls: string[]): string[]`

  - Find URLs that exist in currentUrls but not in previousUrls

- `fetchAndProcessSitemap(url: string, baseUrl?: string): Promise<string[]>`

  - Fetch a sitemap from the given URL and extract all URLs

- `fetchAndProcessSitemapIndex(indexUrl: string, baseUrl?: string): Promise<string[]>`
  - Fetch a sitemap index and process all referenced sitemaps

### Logger Interface

Interface for custom loggers.

```typescript
interface Logger {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}
```

## License

MIT
