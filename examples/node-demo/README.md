# Stripe Loaders Node.js Demo

This is a demonstration project showing how to use the Stripe Loaders packages in a Node.js environment with TypeScript.

## Features

This demo showcases:

- Using `SitemapProcessor` from `stripe-loaders-core` to fetch and process Stripe documentation sitemap
- Using `StripeDocsDocumentLoader` from `langchain-stripe-loader` to load Stripe documentation as structured documents

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn

## Installation

Clone the repository and install dependencies:

```bash
# Navigate to the demo directory
cd examples/node-demo

# Install dependencies
npm install
```

## Running the Demo

To run the demo:

```bash
npm start
```

This will execute the demo script which:

1. Fetches URLs from the Stripe documentation sitemap
2. Shows an example of how document loading would work (actual API calls are commented out to save time)

## Project Structure

- `src/index.ts` - Main demo script showing usage examples
- `package.json` - Project configuration with dependencies and scripts
- `tsconfig.json` - TypeScript configuration

## Notes

- This demo uses ES modules, which is configured in the package.json with `"type": "module"`
- TypeScript is transpiled on-the-fly using ts-node with the ESM loader

## Related Packages

- `stripe-loaders-core` - Core utilities for working with Stripe documentation
- `langchain-stripe-loader` - LangChain integration for loading Stripe documentation
