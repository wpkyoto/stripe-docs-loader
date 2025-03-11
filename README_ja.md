# Stripe Loaders

Stripeのデータを簡単に取得・処理するためのユーティリティライブラリ集です。

## パッケージ

このリポジトリは以下のパッケージを含むモノレポです：

- `stripe-loaders-core`: Stripeデータ取得のための基本的なユーティリティ
- `langchain-stripe-loader`: LangChainと連携してStripeデータを取得するためのローダー

### stripe-loaders-core

Stripeドキュメントのサイトマップを処理するためのユーティリティライブラリです。このライブラリは、Stripeのドキュメントサイトからサイトマップを取得、解析、処理するのに役立ちます。

**特徴：**

- StripeドキュメントのサイトマップからURLを抽出
- 複数のサイトマップからすべてのURLを取得するためのサイトマップインデックスファイルの処理
- 現在と以前のURL一覧を比較して新しく追加されたURLを検出
- カスタムロガーサポートによる設定可能なロギング
- 詳細なログ出力のためのデバッグモード

### langchain-stripe-loader

StripeのドキュメントとウェブサイトコンテンツのためのLangChainドキュメントローダーです。このパッケージは、Stripeのドキュメントとウェブサイトからコンテンツを抽出し、LangChainアプリケーションで使用するための処理ツールを提供します。

**特徴：**

- Stripeの公式ドキュメント（docs.stripe.com）からコンテンツを抽出
- Stripeのメインウェブサイト（stripe.com）からコンテンツを抽出
- 異なるロケール（言語）のサポート
- LLMとの互換性を高めるためのHTMLからMarkdownへの変換
- メタデータ（タイトル、説明、ソースURL）の抽出

## 開発方法

### 依存関係のインストール

```bash
npm install
```

### 開発モード

すべてのパッケージを監視モードでビルドします：

```bash
npm run dev
```

### ビルド

すべてのパッケージをビルドします：

```bash
npm run build
```

### テスト

すべてのパッケージのテストを実行します：

```bash
npm test
```

### クリーンアップ

ビルド成果物を削除します：

```bash
npm run clean
```

## 使用例

### stripe-loaders-core

```typescript
import { SitemapProcessor } from 'stripe-loaders-core';

// プロセッサーのインスタンスを作成
const processor = new SitemapProcessor();

// サイトマップを取得して処理
const urls = await processor.fetchAndProcessSitemap('https://docs.stripe.com/sitemap.xml');
console.log(`Stripeドキュメントから${urls.length}個のURLが見つかりました`);
```

### langchain-stripe-loader

```typescript
// Stripeドキュメントからコンテンツを読み込む
import { StripeDocsDocumentLoader } from 'langchain-stripe-loader';

// ローダーのインスタンスを作成
const loader = new StripeDocsDocumentLoader();

// デフォルトのロケール（en-US）でドキュメントを読み込む
const documents = await loader.load();
console.log(`${documents.length}個のドキュメントを読み込みました`);

// Stripe.comウェブサイトからコンテンツを読み込む
import { StripeComDocumentLoader } from 'langchain-stripe-loader';

// ローダーのインスタンスを作成
const comLoader = new StripeComDocumentLoader();

// 特定のオプションでドキュメントを読み込む
const customDocuments = await comLoader.load({
  resource: '/jobs', // リソースパスでフィルタリング
  locale: 'ja-JP', // ロケールを指定
});
```

## プロジェクト構造

```
stripe-loaders/
├── packages/
│   ├── core/                  # コアライブラリ
│   │   ├── src/               # ソースコード
│   │   ├── package.json       # パッケージ設定
│   │   ├── tsconfig.json      # TypeScript設定
│   │   └── vite.config.ts     # Vite設定
│   │
│   └── langchain-stripe-loader/ # LangChain連携ライブラリ
│       ├── src/               # ソースコード
│       ├── package.json       # パッケージ設定
│       ├── tsconfig.json      # TypeScript設定
│       └── vite.config.ts     # Vite設定
│
├── package.json               # ルートパッケージ設定
├── tsconfig.json              # 共通TypeScript設定
└── README.md                  # ドキュメント
```

## ライセンス

MIT

## 言語

[English README](./README.md)
