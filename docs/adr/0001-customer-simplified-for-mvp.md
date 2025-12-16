# ADR 0001: Customer is simplified for MVP

## Status
Accepted (2025-12-14)

## Context
Rails API + React のエンドツーエンド開発を止めないため、Customer は最小構成で実装。
一方で顧客の社名・住所などは運用上変更されうる（社名変更、移転など）。
請求書は法務・経理上「発行時点の情報」が正であり、マスタ変更で過去請求書の表示が変わってはいけない。

## Decision
- MVPでは `customers` を簡易マスタとして扱う（name + 連絡先 + 任意のcode）。
- `invoices` に宛名等のスナップショット（billing_name, billing_address 等）を持たせ、請求書作成時に `customers` からデフォルトをコピーする。
- `customers` の変更は将来向きとし、既存の請求書を遡及変更しない。
- `customers` の無効化（取引停止/統合など）は MVP では扱わない。

## Consequences
- `customers` マスタが変更されても過去の請求書は安定して表示される。
- 旧社名での検索は主に請求書の宛名スナップショット（invoice.billing_name 等）を検索対象とする。

## Alternatives considered
- `CustomerProfiles`（SCD Type 2）で顧客属性の変更履歴を全て管理する案。
  MVPとしては実装コストが高く、現段階の学習目的に対する投資対効果が低いため見送る。
