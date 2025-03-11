import { SitemapProcessor } from 'stripe-loaders-core';
import { StripeDocsDocumentLoader, StripeComDocumentLoader } from 'langchain-stripe-loader';

async function demoSitemapProcessor() {
  console.log('\n--- Sitemap Processor Demo ---\n');
  
  try {
    const processor = new SitemapProcessor({ debug: true });
    
    console.log('Fetching URLs from Stripe docs sitemap...');
    const urls = await processor.fetchAndProcessSitemap('https://docs.stripe.com/sitemap.xml');
    
    console.log(`Found ${urls.length} URLs. Here are the first 5:`);
    console.log(urls.slice(0, 5));
  } catch (error) {
    console.error('Error processing sitemap:', error);
  }
}

async function demoStripeDocsDocumentLoader() {
  console.log('\n--- Stripe Docs Document Loader Demo ---\n');
  
  try {
    console.log('This would load documents from Stripe docs (skipped for demo)');
    console.log('Example document structure:');
    
    
    // 実際のローダーを使う場合（時間がかかるため、コメントアウト）:
    console.log('Loading documents from Stripe docs...');
    const loader = new StripeDocsDocumentLoader(true);
    const docs = await loader.load();
    console.log(`Loaded ${docs.length} documents.`);
    console.log('First document:', JSON.stringify(docs[0], null, 2));
  } catch (error) {
    console.error('Error loading documents:', error);
  }
}
async function demoStripeComDocumentLoader() {
  console.log('\n--- stripe.com Document Loader Demo ---\n');
  
  try {
    console.log('This would load documents from Stripe docs (skipped for demo)');
    console.log('Example document structure:');
    
    // 実際のAPIコールには時間がかかるため、モック例を表示
    const mockDocument = {
      pageContent: '# Sample Stripe Documentation\n\nThis is sample content for demonstration purposes.',
      metadata: {
        source: 'https://docs.stripe.com/example',
        title: 'Example Stripe Documentation',
        description: 'Sample description'
      }
    };
    
    console.log(JSON.stringify(mockDocument, null, 2));

    
    console.log('Loading documents from Stripe docs...');
    /**
    Basic usage
    */
    const loader = new StripeComDocumentLoader(true);
    const docs = await loader.load({
        resource: 'blog'
    });
    /*/
   /**
    * @see For performance reasons, we are implementing a method that pre-fetches URLs from the sitemap index and only loads 5 documents.
    const processor = new SitemapProcessor({ debug: true });
    const urls = await processor.fetchAndProcessSitemapIndex('https://stripe.com/sitemap/sitemap.xml', 'https://stripe.com/blog');
    const loader = new StripeComDocumentLoader(true);
    const docs = await loader.load({
        urls: urls.slice(0, 5)
    });
    */
    console.log(`Loaded ${docs.length} documents.`);
    console.log('First document:', JSON.stringify(docs[0], null, 2));
  } catch (error) {
    console.error('Error loading documents:', error);
  }
}

// デモの実行
async function runDemo() {
  console.log('====================================');
  console.log('Stripe Loaders Demo');
  console.log('====================================');
  
  await demoSitemapProcessor();
  await demoStripeDocsDocumentLoader();
  //await demoStripeComDocumentLoader();
  
  console.log('\nDemo completed!');
}

runDemo().catch(console.error);