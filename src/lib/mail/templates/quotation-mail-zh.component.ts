import { Component, input } from '@angular/core';

import type { MailData } from '@lib/mail/mail.types';
import { fmtNum, getInfo, parseSelectTypeName } from '@lib/mail/templates/mail-templates.util';

@Component({
    selector: 'lib-quotation-mail-zh',
    standalone: true,
    template: `
        <div class="mail-wrapper">
            <table class="container">
                <tbody>
                    <tr>
                        <td class="title-cell">
                            <div class="title">{{ getInfo('header', data())?.title || '詢價單' }}</div>
                        </td>
                    </tr>

                    <tr>
                        <td class="meta-cell">
                            <div>日期：{{ getInfo('header', data())?.date ?? '-' }}</div>
                            <div class="meta-row">
                                <div>詢價單號：{{ getInfo('header', data())?.serialNumber ?? '-' }}</div>
                                <div>截止日期：{{ getInfo('header', data())?.expiryDate ?? '-' }}</div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td class="section-grid-cell">
                            <table class="section-grid">
                                <tbody>
                                    <tr>
                                        <td class="section-col">
                                            <table class="section-box">
                                                <tbody>
                                                    <tr><td class="section-header">廠商資訊</td></tr>
                                                    <tr>
                                                        <td class="section-body">
                                                            <div>
                                                                廠商編號/名稱：
                                                                {{ getInfo('supplier', data())?.serialNumber ?? '-' }}
                                                                / {{ getInfo('supplier', data())?.name ?? '-' }}
                                                            </div>
                                                            <div class="mt">聯絡窗口：{{ getInfo('supplier', data())?.contactPerson ?? '-' }}</div>
                                                            <div class="mt">手機：{{ getInfo('supplier', data())?.contactMobile ?? '-' }}</div>
                                                            <div class="mt">Email：{{ getInfo('supplier', data())?.contactEmail ?? '-' }}</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td class="section-col">
                                            <table class="section-box">
                                                <tbody>
                                                    <tr><td class="section-header">付款資訊</td></tr>
                                                    <tr>
                                                        <td class="section-body">
                                                            <div>
                                                                營業稅：{{ parseSelectTypeName('VATTypes', getInfo('payment', data())?.vatType) }}
                                                            </div>
                                                            <div class="mt">
                                                                貿易條件：{{ parseSelectTypeName('tradeTerms', getInfo('payment', data())?.tradeTerm) }}
                                                            </div>
                                                            <div class="mt">
                                                                幣別類型：{{ parseSelectTypeName('currencyTypes', getInfo('payment', data())?.currency) }}
                                                            </div>
                                                            <div class="mt">
                                                                付款方式 / 結帳週期 / 付款期限：
                                                                {{ parseSelectTypeName('paymentMethods_02', getInfo('payment', data())?.method) }}
                                                                / {{ parseSelectTypeName('paymentPrepayTerm', getInfo('payment', data())?.cycle) }}
                                                                / {{ parseSelectTypeName('paymentPrepayAmount', getInfo('payment', data())?.term) }}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="table-cell">
                            <table class="item-table">
                                <thead>
                                    <tr>
                                        <th>項次</th>
                                        <th>品名 / 規格 / 廠牌</th>
                                        <th class="right">數量</th>
                                        <th>單位</th>
                                        <th class="right">單價（含稅）</th>
                                        <th class="right">金額</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @for (item of data().items || []; track item.id || $index; let i = $index) {
                                        <tr>
                                            <td>{{ i + 1 }}</td>
                                            <td>
                                                <div>{{ item.name ?? '-' }}</div>
                                                <div>{{ item.spec ?? '-' }}</div>
                                            </td>
                                            <td class="right">{{ fmtNum(item.qty) }}</td>
                                            <td>{{ item.unit ?? '-' }}</td>
                                            <td class="right">$ {{ fmtNum(item.amount) }}</td>
                                            <td class="right">$ {{ fmtNum(item.totalAmount) }}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="summary-cell">
                            <table class="summary-table">
                                <tbody>
                                    <tr>
                                        <td class="right">小計：</td>
                                        <td class="right">$ {{ fmtNum(data().summary?.twdSubtotal) }}</td>
                                    </tr>
                                    <tr>
                                        <td class="right">稅額：</td>
                                        <td class="right">$ {{ fmtNum(data().summary?.twdTax) }}</td>
                                    </tr>
                                    <tr>
                                        <td class="right">運費：</td>
                                        <td class="right">$ {{ fmtNum(data().summary?.shippingFee) }}</td>
                                    </tr>
                                    <tr>
                                        <td class="right strong">總計：</td>
                                        <td class="right strong">$ {{ fmtNum(data().summary?.twdTotal) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    @if (data().signature?.length) {
                        <tr>
                            <td class="signature-cell">簽章欄位（示意）</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    `,
    styles: `
        .mail-wrapper { font-family: Arial, Helvetica, sans-serif; color: #333; font-size: 14px; line-height: 1.5; }
        .container { width: 100%; max-width: 800px; border-collapse: collapse; }
        .title-cell { padding: 20px 12px 12px; text-align: center; }
        .title { font-size: 22px; font-weight: 700; }
        .meta-cell { padding: 0 12px 12px; font-size: 13px; }
        .meta-row { display: flex; justify-content: space-between; gap: 12px; }
        .section-grid-cell { padding: 8px 12px; }
        .section-grid, .section-box, .item-table, .summary-table { width: 100%; border-collapse: collapse; }
        .section-col { width: 50%; padding: 4px; vertical-align: top; }
        .section-header { background: #f5f7fa; padding: 8px 10px; font-weight: 700; color: #555; }
        .section-body { padding: 10px; font-size: 13px; color: #444; }
        .mt { margin-top: 6px; }
        .table-cell { padding: 8px 12px; }
        .item-table { border: 1px solid #eee; font-size: 13px; table-layout: fixed; }
        .item-table th { background: #f5f7fa; border-bottom: 1px solid #ccc; text-align: left; padding: 6px; }
        .item-table td { border-bottom: 1px solid #eee; padding: 6px; vertical-align: top; word-break: break-word; }
        .right { text-align: right; }
        .summary-cell { padding: 8px 12px; }
        .summary-table { background: #f5f7fa; font-size: 13px; }
        .summary-table td { padding: 6px; }
        .strong { font-weight: 700; }
        .signature-cell { padding: 12px; color: #666; border-top: 1px dashed #ccc; }
    `,
})
export class QuotationMailZhComponent {
    readonly data = input.required<MailData>();
    readonly getInfo = getInfo;
    readonly parseSelectTypeName = parseSelectTypeName;
    readonly fmtNum = fmtNum;
}
