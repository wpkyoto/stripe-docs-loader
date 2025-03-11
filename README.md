# Stripe Loaders

A collection of utility libraries for easily retrieving and processing Stripe data.

## Packages

This monorepo contains the following packages:

- `stripe-loaders-core`: Basic utilities for retrieving Stripe data
- `langchain-stripe-loader`: Loader for retrieving Stripe data in conjunction with LangChain

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
import { fetchAndProcessSitemap } from 'stripe-loaders-core';

// Get all URLs from Stripe's sitemap
const urls = await fetchAndProcessSitemap('https://docs.stripe.com/sitemap.xml');
console.log(urls);
```

### langchain-stripe-loader

```typescript
import { StripeDocsLoader } from 'langchain-stripe-loader';

// Create a loader instance
const loader = new StripeDocsLoader();

// Get URLs from sitemap
const urls = await loader.loadFromSitemap('https://docs.stripe.com/sitemap.xml');
console.log(urls);
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