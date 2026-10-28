# client-information

アクセス元のIPアドレス・ホスト名・ユーザーエージェント・HTTPヘッダー・Cookieを確認できるWebアプリです。

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フロントエンド | [Svelte 5](https://svelte.dev/) + TypeScript 7 |
| スタイル | カスタムCSS |
| ビルドツール | Vite 8 |
| テスト | Vitest 5 + Testing Library |
| ホスティング | Firebase Hosting |
| CI/CD | GitHub Actions（`main` ブランチへのプッシュで自動デプロイ） |
| バックエンドAPI | AWS API Gateway + Lambda |

## 開発環境のセットアップ

Node.js 24 が必要です。

```bash
npm install
```

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動（HMR） |
| `npm run build` | プロダクション向けビルド（`dist/` に出力） |
| `npm run preview` | ビルド済みファイルをローカルサーバーで配信 |
| `npm run test` | テストを実行 |
| `npm run test:watch` | テストをウォッチモードで実行 |

## デプロイ

`main` ブランチへプッシュすると GitHub Actions が自動的にビルドし、Firebase Hosting へデプロイします。

- Firebase プロジェクトID: `client-information-ca104`
- 設定ファイル: `firebase.json` / `.firebaserc`

手動でデプロイする場合は [Firebase CLI](https://firebase.google.com/docs/cli) をインストールのうえ、以下を実行してください。

```bash
npm run test
npm run build
firebase deploy
```

## プロジェクト構成

```
.
├── src/
│   ├── main.ts        # エントリーポイント
│   ├── App.svelte     # メインコンポーネント
│   ├── App.test.ts    # テスト
│   ├── setupTests.ts  # テストのセットアップ
│   ├── global.css     # グローバルスタイル
│   └── global.d.ts    # 型定義
├── public/            # 静的ファイル（favicon・ロゴ）
├── dist/              # ビルド出力（git管理外）
├── .github/
│   └── workflows/
│       └── main-deploy.yaml  # CI/CD設定
├── index.html         # HTMLテンプレート
├── vite.config.ts     # Vite・Vitest設定
├── firebase.json      # Firebase Hosting設定
└── package.json
```
