import { Component, input } from '@angular/core';

import type { MailData } from '@lib/mail/mail.types';
import { emailStyles } from '@lib/mail/templates/email-styles';
import { fmtNum, getInfo, parseSelectTypeName } from '@lib/mail/templates/mail-templates.util';
import { SignatureMailZhComponent } from '@lib/mail/templates/signature-mail-zh.component';

@Component({
    selector: 'lib-quotation-mail-zh',
    standalone: true,
    imports: [SignatureMailZhComponent],
    template: `
        <div [style]="styles.wrapper">
            <table width="100%" cellpadding="0" cellspacing="0" [style]="styles.tableCollapse">
                <tbody>
                    <tr>
                        <td align="center">
                            <table [style]="styles.container">
                                <tbody>
                                    <tr>
                                        <td [style]="styles.titleCell">
                                            <div [style]="styles.title">
                                                {{ getInfo('header', data())?.title || '詢價單' }}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td [style]="styles.metaCell">
                                            <div>日期：{{ getInfo('header', data())?.date ?? '-' }}</div>
                                            <div [style]="styles.metaRow">
                                                <div>
                                                    詢價單號：{{ getInfo('header', data())?.serialNumber ?? '-' }}
                                                </div>
                                                <div>
                                                    截止日期：{{ getInfo('header', data())?.expiryDate ?? '-' }}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td [style]="styles.sectionGridCell">
                                            <table width="100%" cellpadding="0" cellspacing="0" [style]="styles.tableCollapse">
                                                <tbody>
                                                    <tr>
                                                        <td width="50%" [style]="styles.sectionCol">
                                                            <table width="100%" cellpadding="0" cellspacing="0" [style]="styles.tableCollapse">
                                                                <tbody>
                                                                    <tr>
                                                                        <td [style]="styles.sectionHeader">廠商資訊</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td [style]="styles.sectionBody">
                                                                            <div>
                                                                                廠商編號/名稱：
                                                                                {{ getInfo('supplier', data())?.serialNumber ?? '-' }}
                                                                                /
                                                                                {{ getInfo('supplier', data())?.name ?? '-' }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                聯絡窗口：{{ getInfo('supplier', data())?.contactPerson ?? '-' }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                手機：{{ getInfo('supplier', data())?.contactMobile ?? '-' }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                Email：
                                                                                <a
                                                                                    [href]="'mailto:' + (getInfo('supplier', data())?.contactEmail ?? '')"
                                                                                    [style]="styles.mailLink"
                                                                                >
                                                                                    {{ getInfo('supplier', data())?.contactEmail ?? '-' }}
                                                                                </a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td width="50%" [style]="styles.sectionCol">
                                                            <table width="100%" cellpadding="0" cellspacing="0" [style]="styles.tableCollapse">
                                                                <tbody>
                                                                    <tr>
                                                                        <td [style]="styles.sectionHeader">付款資訊</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td [style]="styles.sectionBody">
                                                                            <div>
                                                                                營業稅：{{ parseSelectTypeName('VATTypes', getInfo('payment', data())?.vatType) }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                貿易條件：{{ parseSelectTypeName('tradeTerms', getInfo('payment', data())?.tradeTerm) }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                幣別類型：{{ parseSelectTypeName('currencyTypes', getInfo('payment', data())?.currency) }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                付款方式 / 結帳週期 / 付款期限：
                                                                                {{ parseSelectTypeName('paymentMethods_02', getInfo('payment', data())?.method) }}
                                                                                /
                                                                                {{ parseSelectTypeName('paymentPrepayTerm', getInfo('payment', data())?.cycle) }}
                                                                                /
                                                                                {{ parseSelectTypeName('paymentPrepayAmount', getInfo('payment', data())?.term) }}
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
                                        <td [style]="styles.itemTableCell">
                                            <table cellpadding="6" cellspacing="0" [style]="styles.itemTable">
                                                <thead>
                                                    <tr [style]="styles.itemTableHeadRow">
                                                        <th [style]="styles.itemTableTh">項次</th>
                                                        <th [style]="styles.itemTableTh">品名 / 規格 / 廠牌</th>
                                                        <th [style]="styles.itemTableThRight">數量</th>
                                                        <th [style]="styles.itemTableTh">單位</th>
                                                        <th [style]="styles.itemTableThRight">單價（含稅）</th>
                                                        <th [style]="styles.itemTableThRight">金額</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    @for (item of data().items || []; track item.id || $index; let i = $index) {
                                                        <tr [style]="styles.itemTableRow">
                                                            <td [style]="styles.itemTableTd">{{ i + 1 }}</td>
                                                            <td [style]="styles.itemTableTd">
                                                                <div>{{ item.name ?? '-' }}</div>
                                                                <div>{{ item.spec ?? '-' }}</div>
                                                            </td>
                                                            <td [style]="styles.itemTableTdRight">{{ fmtNum(item.qty) }}</td>
                                                            <td [style]="styles.itemTableTd">{{ item.unit ?? '-' }}</td>
                                                            <td [style]="styles.itemTableTdRight">$ {{ fmtNum(item.amount) }}</td>
                                                            <td [style]="styles.itemTableTdRight">$ {{ fmtNum(item.totalAmount) }}</td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td [style]="styles.summaryCell">
                                            <table width="100%" cellpadding="6" cellspacing="0" [style]="styles.summaryTable">
                                                <tbody>
                                                    <tr>
                                                        <td [style]="styles.summaryTdRight">小計：</td>
                                                        <td [style]="styles.summaryTdRight">$ {{ fmtNum(data().summary?.twdSubtotal) }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td [style]="styles.summaryTdRight">稅額：</td>
                                                        <td [style]="styles.summaryTdRight">$ {{ fmtNum(data().summary?.twdTax) }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td [style]="styles.summaryTdRight">運費：</td>
                                                        <td [style]="styles.summaryTdRight">$ {{ fmtNum(data().summary?.shippingFee) }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td [style]="styles.summaryTdRight">
                                                            <span [style]="styles.summaryStrong">總計：</span>
                                                        </td>
                                                        <td [style]="styles.summaryTdRight">
                                                            <span [style]="styles.summaryStrong">$ {{ fmtNum(data().summary?.twdTotal) }}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    <lib-signature-mail-zh [data]="data()" />
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
})
export class QuotationMailZhComponent {
    readonly data = input.required<MailData>();
    readonly styles = emailStyles;
    readonly getInfo = getInfo;
    readonly parseSelectTypeName = parseSelectTypeName;
    readonly fmtNum = fmtNum;
}
