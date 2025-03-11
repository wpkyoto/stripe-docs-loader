# LangChain Stripe Loader

A LangChain document loader for Stripe documentation and website content. This package provides tools to extract and process content from Stripe's documentation and website for use with LangChain applications.

## Installation

```bash
npm install langchain-stripe-loader
```

## Features

- Extract content from Stripe's official documentation (docs.stripe.com)
- Extract content from Stripe's main website (stripe.com)
- Support for different locales
- Convert HTML content to Markdown for better compatibility with LLMs
- Metadata extraction (title, description, source URL)

## Usage

### Loading Content from Stripe Documentation

```typescript
import { StripeDocsDocumentLoader } from 'langchain-stripe-loader';

// Create a loader instance
const loader = new StripeDocsDocumentLoader();

// Load documents with default locale (en-US)
const documents = await loader.load();

// Or specify a different locale
const jaDocuments = await loader.load({
  locale: 'ja-JP',
});

// Load documents with specific options
const customDocuments = await loader.load({
  resource: 'connect', // Filter by resource path
  excludeResources: ['connect/account-balances'],
});

// Use the documents with your LangChain application
console.log(`Loaded ${documents.length} documents`);
```

### Loading Content from Stripe.com Website

```typescript
import { StripeComDocumentLoader } from 'langchain-stripe-loader';

// Create a loader instance
const loader = new StripeComDocumentLoader();

// Load all documents
const documents = await loader.load();

// Load documents with specific options
const customDocuments = await loader.load({
  resource: '/jobs', // Filter by resource path
  locale: 'en-US', // Specify locale
});

// Load specific URLs
const specificDocuments = await loader.load({
  urls: ['https://stripe.com/docs/payments', 'https://stripe.com/docs/billing'],
});
```

## API Reference

### StripeDocsDocumentLoader

Document loader for Stripe's official documentation (docs.stripe.com).

**Constructor**

```typescript
constructor(debug: boolean = false)
```

- `debug`: Enable debug logging

**Methods**

- `load(locale: string = 'en-US'): Promise<Document[]>` - Load documents from Stripe Docs with the specified locale

### StripeComDocumentLoader

Document loader for Stripe's main website (stripe.com).

**Constructor**

```typescript
constructor(debug: boolean = false)
```

- `debug`: Enable debug logging

**Methods**

- `load(options?: { resource?: string; locale?: string; urls?: string[] }): Promise<Document[]>` - Load documents from Stripe.com with optional filtering

## How It Works

1. The loaders fetch URLs from Stripe's sitemaps
2. HTML content is downloaded from each URL
3. Relevant content is extracted using regex patterns
4. HTML is converted to Markdown using Turndown
5. Content is wrapped in LangChain Document objects with metadata

## Dependencies

- `@langchain/core`: LangChain core functionality
- `stripe-loaders-core`: Core utilities for Stripe loaders
- `turndown`: HTML to Markdown conversion

## License

MIT
