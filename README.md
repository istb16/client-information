# client-information

アクセス元のIPアドレス・ホスト名・ユーザーエージェント・HTTPヘッダー・Cookieを確認できるWebアプリです。

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フロントエンド | [Svelte 5](https://svelte.dev/) + TypeScript 5 |
| スタイル | Bootstrap 5 + カスタムCSS |
| ビルドツール | Rollup 4 |
| ホスティング | Firebase Hosting |
| CI/CD | GitHub Actions（`main` ブランチへのプッシュで自動デプロイ） |
| バックエンドAPI | AWS API Gateway + Lambda |

## 開発環境のセットアップ

Node.js が必要です。

```bash
npm install
```

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run serve` | 開発サーバー起動（ファイル監視＋ライブリロード） |
| `npm run build` | プロダクション向けビルド（`public/build/` に出力） |
| `npm run start` | ビルド済みファイルをローカルサーバーで配信 |
| `npm run check` | TypeScript の型チェック |

## デプロイ

`main` ブランチへプッシュすると GitHub Actions が自動的にビルドし、Firebase Hosting へデプロイします。

- Firebase プロジェクトID: `client-information-ca104`
- 設定ファイル: `firebase.json` / `.firebaserc`

手動でデプロイする場合は [Firebase CLI](https://firebase.google.com/docs/cli) をインストールのうえ、以下を実行してください。

```bash
npm run build
firebase deploy
```

## プロジェクト構成

```
.
├── src/
│   ├── main.ts        # エントリーポイント
│   ├── App.svelte     # メインコンポーネント
│   └── global.d.ts    # 型定義
├── public/
│   ├── index.html     # HTMLテンプレート
│   ├── global.css     # グローバルスタイル
│   └── build/         # ビルド出力（git管理外）
├── .github/
│   └── workflows/
│       └── main-deploy.yaml  # CI/CD設定
├── rollup.config.js   # Rollup設定
├── firebase.json      # Firebase Hosting設定
└── package.json
```
