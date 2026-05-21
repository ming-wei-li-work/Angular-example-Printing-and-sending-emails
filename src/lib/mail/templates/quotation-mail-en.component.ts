import { Component, input } from '@angular/core';

import type { MailData } from '@lib/mail/mail.types';
import { emailStyles } from '@lib/mail/templates/email-styles';
import { fmtNum, getInfo, parseSelectTypeName } from '@lib/mail/templates/mail-templates.util';
import { SignatureMailEnComponent } from '@lib/mail/templates/signature-mail-en.component';

@Component({
    selector: 'lib-quotation-mail-en',
    standalone: true,
    imports: [SignatureMailEnComponent],
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
                                            <div [style]="styles.title">Quotation</div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td [style]="styles.metaCell">
                                            <div>Date: {{ getInfo('header', data())?.date ?? '-' }}</div>
                                            <div [style]="styles.metaRow">
                                                <div>Quotation: {{ getInfo('header', data())?.serialNumber ?? '-' }}</div>
                                                <div>Deadline: {{ getInfo('header', data())?.expiryDate ?? '-' }}</div>
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
                                                                        <td [style]="styles.sectionHeader">Vendor Information</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td [style]="styles.sectionBody">
                                                                            <div>
                                                                                Vendor ID / Name:
                                                                                {{ getInfo('supplier', data())?.serialNumber ?? '-' }}
                                                                                /
                                                                                {{ getInfo('supplier', data())?.name ?? '-' }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                Contact Person: {{ getInfo('supplier', data())?.contactPerson ?? '-' }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                Mobile: {{ getInfo('supplier', data())?.contactMobile ?? '-' }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                Email:
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
                                                                        <td [style]="styles.sectionHeader">Payment Information</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td [style]="styles.sectionBody">
                                                                            <div>
                                                                                Tax Rate: {{ parseSelectTypeName('VATTypes', getInfo('payment', data())?.vatType) }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                Trade Terms: {{ parseSelectTypeName('tradeTerms', getInfo('payment', data())?.tradeTerm) }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                Currency: {{ parseSelectTypeName('currencyTypes', getInfo('payment', data())?.currency) }}
                                                                            </div>
                                                                            <div [style]="styles.mt">
                                                                                Method / Billing Cycle / Terms:
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
                                                        <th [style]="styles.itemTableTh">Item No.</th>
                                                        <th [style]="styles.itemTableTh">Product Name / Specification / Brand</th>
                                                        <th [style]="styles.itemTableThRight">Quantity</th>
                                                        <th [style]="styles.itemTableTh">Unit</th>
                                                        <th [style]="styles.itemTableThRight">Unit Price (Including Tax)</th>
                                                        <th [style]="styles.itemTableThRight">Amount</th>
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
                                                        <td [style]="styles.summaryTdRight">
                                                            <span [style]="styles.summaryStrong">Subtotal:</span>
                                                        </td>
                                                        <td [style]="styles.summaryTdRight">$ {{ fmtNum(data().summary?.localSubtotal) }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td [style]="styles.summaryTdRight">Tax:</td>
                                                        <td [style]="styles.summaryTdRight">$ {{ fmtNum(data().summary?.twdTax) }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td [style]="styles.summaryTdRight">Shipping:</td>
                                                        <td [style]="styles.summaryTdRight">$ {{ fmtNum(data().summary?.shippingFee) }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td [style]="styles.summaryTdRight">
                                                            <span [style]="styles.summaryStrong">Total Amount:</span>
                                                        </td>
                                                        <td [style]="styles.summaryTdRight">
                                                            <span [style]="styles.summaryStrong">$ {{ fmtNum(data().summary?.localTotal) }}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    <lib-signature-mail-en [data]="data()" />
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
})
export class QuotationMailEnComponent {
    readonly data = input.required<MailData>();
    readonly styles = emailStyles;
    readonly getInfo = getInfo;
    readonly parseSelectTypeName = parseSelectTypeName;
    readonly fmtNum = fmtNum;
}
