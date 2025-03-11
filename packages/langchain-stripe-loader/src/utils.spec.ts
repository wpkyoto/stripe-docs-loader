import { describe, it, expect } from 'vitest';
import { extractBodyFromHTML, extractArticleFromHTML } from './utils';

describe('extractBodyFromHTML', () => {
  it('正常なHTMLからbodyタグの内容を抽出できること', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>テストページ</title>
        </head>
        <body>
          <p>これはテスト本文です。</p>
        </body>
      </html>
    `;
    
    const result = extractBodyFromHTML(html);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('これはテスト本文です。');
  });

  it('複数のbodyタグがある場合、すべて抽出できること', () => {
    const html = `
      <body>最初の本文</body>
      <div>中間コンテンツ</div>
      <body>2番目の本文</body>
    `;
    
    const result = extractBodyFromHTML(html);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('最初の本文');
    expect(result[1]).toBe('2番目の本文');
  });

  it('bodyタグが存在しない場合、空の配列を返すこと', () => {
    const html = '<div>bodyタグなし</div>';
    
    const result = extractBodyFromHTML(html);
    
    expect(result).toEqual([]);
  });

  it('属性付きのbodyタグからも内容を抽出できること', () => {
    const html = '<body class="main-content" id="page-body">属性付きbody</body>';
    
    const result = extractBodyFromHTML(html);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('属性付きbody');
  });

  it('無効な入力に対してエラーを投げずに空配列を返すこと', () => {
    const result = extractBodyFromHTML(null as unknown as string);
    
    expect(result).toEqual([]);
  });
});

describe('extractArticleFromHTML', () => {
  it('正常なHTMLからarticleタグの内容を抽出できること', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <article>
            <h1>記事タイトル</h1>
            <p>記事の内容</p>
          </article>
        </body>
      </html>
    `;
    
    const result = extractArticleFromHTML(html);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('記事タイトル');
    expect(result[0]).toContain('記事の内容');
  });

  it('複数のarticleタグがある場合、すべて抽出できること', () => {
    const html = `
      <article>最初の記事</article>
      <div>中間コンテンツ</div>
      <article>2番目の記事</article>
    `;
    
    const result = extractArticleFromHTML(html);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('最初の記事');
    expect(result[1]).toBe('2番目の記事');
  });

  it('articleタグが存在しない場合、空の配列を返すこと', () => {
    const html = '<div>articleタグなし</div>';
    
    const result = extractArticleFromHTML(html);
    
    expect(result).toEqual([]);
  });

  it('属性付きのarticleタグからも内容を抽出できること', () => {
    const html = '<article class="blog-post" id="featured">属性付きarticle</article>';
    
    const result = extractArticleFromHTML(html);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('属性付きarticle');
  });

  it('無効な入力に対してエラーを投げずに空配列を返すこと', () => {
    const result = extractArticleFromHTML(null as unknown as string);
    
    expect(result).toEqual([]);
  });
});
