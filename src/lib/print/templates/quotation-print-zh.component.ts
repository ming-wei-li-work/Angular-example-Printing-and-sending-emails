import { Component, input } from '@angular/core';
import { CONTRACT_STYLES } from '@lib/print/contract-styles';
import type { PrintData } from '@lib/print/print.types';
import { parseSelectTypeName } from '@lib/shared/select.util';

@Component({
    selector: 'lib-quotation-print-zh',
    standalone: true,
    template: `
        <div id="contract" class="relative p-8 w-full flex justify-center" data-print-root="contract">
            <div [class]="s['container']" id="contract-outer">
                <h1
                    id="title"
                    [class]="s['title']"
                    data-print-block="true"
                    data-print-atomic="true"
                    role="heading"
                    aria-level="1"
                >
                    {{ data().header?.title || '詢價單' }}
                </h1>

                <div id="contract-body" class="w-full" data-print-body="true">
                    <div [class]="s['card']" data-print-block="true" data-print-atomic="true">
                        <div id="date" [class]="s['dateHeader'] + ' flex justify-between'">
                            <div class="space-y-1 text-sm">
                                <div>日期：{{ data().header?.date }}</div>
                                <div>採購單號：{{ data().header?.serialNumber }}</div>
                                <div>採購截止日期：{{ data().header?.expiryDate }}</div>
                            </div>

                            <div class="space-y-1 text-sm text-right">
                                <div>詢價人員：{{ data().header?.userName }}</div>
                                <div>手機：{{ data().header?.phone }}</div>
                                <div>Email：{{ data().header?.email }}</div>
                            </div>
                        </div>

                        <div id="twoColumns" [class]="s['twoCols']">
                            <div [class]="s['col']">
                                <div [class]="s['header']">
                                    <span [class]="s['headerLabel']">廠商資訊</span>
                                </div>
                                <div [class]="s['content']">
                                    <div>
                                        廠商編號/名稱：{{ data().supplier?.serialNumber }} /
                                        {{ data().supplier?.name }}
                                    </div>
                                    <div>聯絡窗口：{{ data().supplier?.contactPerson }}</div>
                                    <div>手機：{{ data().supplier?.contactMobile }}</div>
                                    <div>Email：{{ data().supplier?.contactEmail }}</div>
                                    <div>公司電話：{{ data().supplier?.contactNumber }}</div>
                                    <div>公司傳真：{{ data().supplier?.contactFaxNumber }}</div>
                                </div>
                            </div>

                            <div [class]="s['col']">
                                <div [class]="s['header']">
                                    <span [class]="s['headerLabel']">付款資訊</span>
                                </div>
                                <div [class]="s['content']">
                                    <div>
                                        營業稅：{{
                                            parseSelectTypeName(
                                                'VATTypes',
                                                data().payment?.vatType || ''
                                            )
                                        }}
                                    </div>
                                    <div>
                                        貿易條件：{{
                                            parseSelectTypeName(
                                                'tradeTerms',
                                                data().payment?.tradeTerm || ''
                                            )
                                        }}
                                    </div>
                                    <div>
                                        幣別類型：{{
                                            parseSelectTypeName(
                                                'currencyTypes',
                                                data().payment?.currency || ''
                                            )
                                        }}
                                    </div>
                                    <div>
                                        付款方式 / 結帳週期 / 付款期限：
                                        {{
                                            parseSelectTypeName(
                                                'paymentMethods_02',
                                                data().payment?.method || '-'
                                            )
                                        }}
                                        /
                                        {{
                                            parseSelectTypeName(
                                                'paymentPrepayTerm',
                                                data().payment?.cycle || '-'
                                            )
                                        }}
                                        /
                                        {{
                                            parseSelectTypeName(
                                                'paymentPrepayAmount',
                                                data().payment?.term || '-'
                                            )
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="tableAndSummary" [class]="s['tableContainer']">
                        <div data-print-block="true">
                            <div
                                [class]="
                                    s['tableHeaderRow'] +
                                    ' grid !grid-cols-6 gap-2 font-semibold border-b border-gray-300'
                                "
                                data-print-table-header="true"
                            >
                                <div class="text-left">項次</div>
                                <div class="text-left">品名 / 規格 / 廠牌</div>
                                <div class="text-right">數量</div>
                                <div class="text-left">單位</div>
                                <div class="text-right">單價（含稅）</div>
                                <div class="text-right">金額</div>
                            </div>

                            @for (item of data().items || []; track item.id || $index; let i = $index) {
                                <div
                                    data-print-table-row="true"
                                    class="grid grid-cols-6 gap-2 border-b border-gray-200 py-2 px-3 text-sm"
                                >
                                    <div class="text-left">{{ i + 1 }}</div>
                                    <div class="flex flex-col gap-1 text-left">
                                        <div class="flex flex-wrap gap-2">
                                            <span>{{ item.name }}</span>
                                        </div>
                                        <div>{{ item.spec }}</div>
                                    </div>
                                    <div class="text-right">{{ formatValue(item.qty) }}</div>
                                    <div class="text-left">{{ item.unit }}</div>
                                    <div class="text-right">$ {{ formatCurrency(item.amount) }}</div>
                                    <div class="text-right">
                                        $ {{ formatCurrency(item.totalAmount) }}
                                    </div>
                                </div>
                            }
                        </div>

                        <div
                            id="summary"
                            [class]="s['tableSummary']"
                            data-print-block="true"
                            data-print-atomic="true"
                        >
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div class="col-span-2 flex flex-col gap-2">
                                <div class="flex justify-between items-center">
                                    <span>小計</span>
                                    <span class="flex items-center gap-1 text-[#082f49]">
                                        $ {{ formatValue(data().summary?.twdSubtotal, 0) }}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>稅額</span>
                                    <span class="flex items-center gap-1 text-[#082f49]">
                                        $ {{ formatValue(data().summary?.twdTax, 0) }}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>運費</span>
                                    <span class="flex items-center gap-1 text-[#082f49]">
                                        $ {{ formatValue(data().summary?.shippingFee, 0) }}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center font-bold text-zinc-900">
                                    <span>總計</span>
                                    <span class="flex items-center gap-1">
                                        $ {{ formatValue(data().summary?.twdTotal, 0) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class QuotationPrintZhComponent {
    readonly data = input.required<PrintData>();
    readonly s = CONTRACT_STYLES;
    readonly parseSelectTypeName = parseSelectTypeName;

    formatValue(value: number | string | null | undefined, fallback: string | number = '-'): string | number {
        if (value === null || value === undefined || value === '') return fallback;
        if (typeof value === 'number') return value.toLocaleString();
        return value;
    }

    formatCurrency(value: number | null | undefined): string {
        if (value === null || value === undefined) return '-';
        return value.toLocaleString(undefined, { maximumFractionDigits: 3 });
    }
}
