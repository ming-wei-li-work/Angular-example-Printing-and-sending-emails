import { Component, input } from '@angular/core';
import { CONTRACT_STYLES } from '@lib/print/contract-styles';
import type { PrintData } from '@lib/print/print.types';
import { parseSelectTypeName } from '@lib/shared/select.util';

@Component({
    selector: 'lib-quotation-print-en',
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
                    Quotation
                </h1>

                <div id="contract-body" class="w-full" data-print-body="true">
                    <div [class]="s['card']" data-print-block="true" data-print-atomic="true">
                        <div id="date" [class]="s['dateHeader'] + ' flex justify-between'">
                            <div class="space-y-1 text-sm">
                                <div>Date: {{ data().header?.date }}</div>
                                <div>Quotation: {{ data().header?.serialNumber }}</div>
                                <div>Deadline: {{ data().header?.expiryDate }}</div>
                            </div>

                            <div class="space-y-1 text-sm text-right">
                                <div>Consultant: {{ data().header?.userName }}</div>
                                <div>Phone: {{ data().header?.phone }}</div>
                                <div>Email: {{ data().header?.email }}</div>
                            </div>
                        </div>

                        <div id="twoColumns" [class]="s['twoCols']">
                            <div [class]="s['col']">
                                <div [class]="s['header']">
                                    <span [class]="s['headerLabel']">Vendor Information</span>
                                </div>
                                <div [class]="s['content']">
                                    <div>
                                        Vendor ID / Name：{{ data().supplier?.serialNumber }} /
                                        {{ data().supplier?.name }}
                                    </div>
                                    <div>Contact Person：{{ data().supplier?.contactPerson }}</div>
                                    <div>Mobile：{{ data().supplier?.contactMobile }}</div>
                                    <div>Email：{{ data().supplier?.contactEmail }}</div>
                                    <div>Tel：{{ data().supplier?.contactNumber }}</div>
                                    <div>Fax：{{ data().supplier?.contactFaxNumber }}</div>
                                </div>
                            </div>

                            <div [class]="s['col']">
                                <div [class]="s['header']">
                                    <span [class]="s['headerLabel']">Payment Information</span>
                                </div>
                                <div [class]="s['content']">
                                    <div>
                                        Tax Rate：{{
                                            parseSelectTypeName(
                                                'VATTypes',
                                                data().payment?.vatType || ''
                                            )
                                        }}
                                    </div>
                                    <div>
                                        Trade Terms：{{
                                            parseSelectTypeName(
                                                'tradeTerms',
                                                data().payment?.tradeTerm || ''
                                            )
                                        }}
                                    </div>
                                    <div>
                                        Currency：{{
                                            parseSelectTypeName(
                                                'currencyTypes',
                                                data().payment?.currency || ''
                                            )
                                        }}
                                    </div>
                                    <div>
                                        Method / Billing Cycle / Terms：
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
                                <div class="text-left">Item No.</div>
                                <div class="text-left">Product Name / Specification / Brand</div>
                                <div class="text-right">Quantity</div>
                                <div class="text-left">Unit</div>
                                <div class="text-right">Unit Price (Including Tax)</div>
                                <div class="text-right">Amount</div>
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
                                    <span>Subtotal</span>
                                    <span class="flex items-center gap-1 text-[#082f49]">
                                        $ {{ formatValue(data().summary?.localSubtotal, 0) }}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Tax</span>
                                    <span class="flex items-center gap-1 text-[#082f49]">
                                        $ {{ formatValue(data().summary?.twdTax, 0) }}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Shipping</span>
                                    <span class="flex items-center gap-1 text-[#082f49]">
                                        $ {{ formatValue(data().summary?.shippingFee, 0) }}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center font-bold text-zinc-900">
                                    <span>Total Amount</span>
                                    <span class="flex items-center gap-1">
                                        $ {{ formatValue(data().summary?.localTotal, 0) }}
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
export class QuotationPrintEnComponent {
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
