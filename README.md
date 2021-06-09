# 初期設定

Node が動く環境で yarn を利用して下記コマンドを実行

```
yarn install
```

# webpack による build

build されたファイルはプロジェクトルートの`dist`フォルダ直下に生成される．
`public`フォルダが本リポジトリのアプリケーションとなる．

## 開発環境

```
yarn build:dev
```

## 本番環境

```
yarn build:prod
```
