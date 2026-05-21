# 列印與寄信元件範例（Angular 21）

獨立的 Angular 21 範例專案，展示**詢價單**的列印與寄信流程。所有公司、人員、供應商資料均為虛構 mock，與任何真實組織無關。

技術棧：Standalone Components、Signals、`inject()`、Angular Material、[Angular 21](https://dev.angular.tw/)。

## 線上 Demo（GitHub Pages）

push 至 `main` 分支後，GitHub Actions 會自動部署靜態站。

**網址：** [https://ming-wei-li-work.github.io/Angular-example-Printing-and-sending-emails/](https://ming-wei-li-work.github.io/Angular-example-Printing-and-sending-emails/)

### 首次啟用 GitHub Pages

1. 將專案 push 到 GitHub（預設分支 `main`）
2. 進入 repo **Settings → Pages**
3. **Build and deployment → Source** 選 **GitHub Actions**
4. 等待 Actions 中 `Deploy to GitHub Pages` workflow 完成

## 功能

- **列印**：選擇 Alpha / Beta × 中/英文，新視窗預覽後手動按「列印」
- **寄信**：Material Dialog 表單、iframe HTML 預覽、mock 送出
- **Mock 附件上傳**：本地模擬，不連接檔案 API

## 本地開發

```bash
npm install
npm start
```

開啟 [http://localhost:4200](http://localhost:4200)。

> Angular CLI 21 需要 Node.js **v20.19+** 或 **v22.12+**。

## 公開 API

```typescript
import { PrintButtonComponent } from '@lib/print';
import { MailButtonComponent } from '@lib/mail';
import { mapQuotationToPrintData, mapQuotationToMailData } from '@lib/mappers/quotation.mapper';
import { mockDemoContext } from '@lib/mock/demo-context';
import { mockQuotationOrder } from '@lib/mock/quotation-order';

const printData = mapQuotationToPrintData(mockQuotationOrder, mockDemoContext)!;
const mailData = mapQuotationToMailData(mockQuotationOrder, mockDemoContext)!;

// template:
// <lib-print-button [data]="printData" />
// <lib-mail-button [data]="mailData" [context]="mockDemoContext" defaultTo="supplier@example.com" />
```

## 目錄結構

```
src/
├── app/                    # Demo 頁
├── lib/
│   ├── print/              # PrintEngineService、PrintButton、quotation 模板
│   ├── mail/               # MailButton、MailDialog、quotation 郵件模板
│   ├── mappers/            # 詢價單 → PrintData / MailData
│   ├── mock/               # demo-context、quotation-order、mock-api
│   └── shared/             # ComponentRenderService
public/
├── logo-alpha.svg, logo-beta.svg
├── print.css, theme.css
└── .github/workflows/      # GitHub Pages 自動部署
```

## 建置

```bash
npm run build
# 產出 dist/angular-print-mail-demo/browser
```

## 擴充

- 接入真實 SMTP：替換 `MockApiService.sendEmail`
- 恢復自動列印：`PrintEngineService.openPrint(..., { autoPrint: true })`
- 新增單據類型：在 `lib/mappers/` 新增 mapper 並擴充模板
