import { Component } from '@angular/core';

import { PrintButtonComponent } from '@lib/print/print-button.component';
import { MailButtonComponent } from '@lib/mail/mail-button.component';
import { mapQuotationToMailData, mapQuotationToPrintData } from '@lib/mappers/quotation.mapper';
import { mockDemoContext } from '@lib/mock/demo-context';
import { mockQuotationOrder, MOCK_ORDER_ID } from '@lib/mock/quotation-order';

/**
 * Demo 頁：展示最小串接——mock 詢價單 → mapper → PrintButton / MailButton。
 * 不含 adapter、provider 或全域 store。
 */
@Component({
    selector: 'app-root',
    imports: [PrintButtonComponent, MailButtonComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly mockDemoContext = mockDemoContext;
    protected readonly mockQuotationOrder = mockQuotationOrder;
    protected readonly mockOrderId = MOCK_ORDER_ID;

    protected readonly printData = mapQuotationToPrintData(mockQuotationOrder, mockDemoContext)!;
    protected readonly mailData = mapQuotationToMailData(mockQuotationOrder, mockDemoContext)!;

    protected readonly itemCount = mockQuotationOrder.detail_info?.length ?? 0;
    protected readonly supplierName =
        mockDemoContext.supplierValues[0]?.name ?? '示範供應商股份有限公司';
    protected readonly operatorName = mockDemoContext.peopleValues[0]?.name ?? '示範員工 A';
}
