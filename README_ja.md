# Stripe Loaders

Stripeのデータを簡単に取得・処理するためのユーティリティライブラリ集です。

## パッケージ

このリポジトリは以下のパッケージを含むモノレポです：

- `stripe-loaders-core`: Stripeデータ取得のための基本的なユーティリティ
- `langchain-stripe-loader`: LangChainと連携してStripeデータを取得するためのローダー

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
import { fetchAndProcessSitemap } from 'stripe-loaders-core';

// Stripeのサイトマップから全URLを取得
const urls = await fetchAndProcessSitemap('https://docs.stripe.com/sitemap.xml');
console.log(urls);
```

### langchain-stripe-loader

```typescript
import { StripeDocsLoader } from 'langchain-stripe-loader';

// ローダーのインスタンスを作成
const loader = new StripeDocsLoader();

// サイトマップからURLを取得
const urls = await loader.loadFromSitemap('https://docs.stripe.com/sitemap.xml');
console.log(urls);
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