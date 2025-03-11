# Stripe Loaders

A collection of utility libraries for easily retrieving and processing Stripe data.

## Packages

This monorepo contains the following packages:

- `stripe-loaders-core`: Basic utilities for retrieving Stripe data
- `langchain-stripe-loader`: Loader for retrieving Stripe data in conjunction with LangChain

### stripe-loaders-core

A utility library for processing Stripe documentation sitemaps. This library helps you fetch, parse, and process sitemaps from Stripe's documentation site.

**Features:**
- Extract URLs from Stripe documentation sitemaps
- Process sitemap index files to get all URLs from multiple sitemaps
- Find newly added URLs by comparing current and previous URL lists
- Configurable logging with custom logger support
- Debug mode for detailed logging

### langchain-stripe-loader

A LangChain document loader for Stripe documentation and website content. This package provides tools to extract and process content from Stripe's documentation and website for use with LangChain applications.

**Features:**
- Extract content from Stripe's official documentation (docs.stripe.com)
- Extract content from Stripe's main website (stripe.com)
- Support for different locales
- Convert HTML content to Markdown for better compatibility with LLMs
- Metadata extraction (title, description, source URL)

## Development

### Installing Dependencies

```bash
npm install
```

### Development Mode

Build all packages in watch mode:

```bash
npm run dev
```

### Build

Build all packages:

```bash
npm run build
```

### Test

Run tests for all packages:

```bash
npm test
```

### Cleanup

Remove build artifacts:

```bash
npm run clean
```

## Usage Examples

### stripe-loaders-core

```typescript
import { SitemapProcessor } from 'stripe-loaders-core';

// Create a processor instance
const processor = new SitemapProcessor();

// Fetch and process a sitemap
const urls = await processor.fetchAndProcessSitemap('https://docs.stripe.com/sitemap.xml');
console.log(`Found ${urls.length} URLs in the Stripe documentation`);
```

### langchain-stripe-loader

```typescript
// Loading content from Stripe Documentation
import { StripeDocsDocumentLoader } from 'langchain-stripe-loader';

// Create a loader instance
const loader = new StripeDocsDocumentLoader();

// Load documents with default locale (en-US)
const documents = await loader.load();
console.log(`Loaded ${documents.length} documents`);

// Loading content from Stripe.com Website
import { StripeComDocumentLoader } from 'langchain-stripe-loader';

// Create a loader instance
const comLoader = new StripeComDocumentLoader();

// Load documents with specific options
const customDocuments = await comLoader.load({
  resource: '/jobs', // Filter by resource path
  locale: 'en-US',   // Specify locale
});
```

## Project Structure

```
stripe-loaders/
├── packages/
│   ├── core/                  # Core library
│   │   ├── src/               # Source code
│   │   ├── package.json       # Package configuration
│   │   ├── tsconfig.json      # TypeScript configuration
│   │   └── vite.config.ts     # Vite configuration
│   │
│   └── langchain-stripe-loader/ # LangChain integration library
│       ├── src/               # Source code
│       ├── package.json       # Package configuration
│       ├── tsconfig.json      # TypeScript configuration
│       └── vite.config.ts     # Vite configuration
│
├── package.json               # Root package configuration
├── tsconfig.json              # Common TypeScript configuration
└── README.md                  # Documentation
```

## License

MIT

## Language

[日本語版のREADME](./README_ja.md)
