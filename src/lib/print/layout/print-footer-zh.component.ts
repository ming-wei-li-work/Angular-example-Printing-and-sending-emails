import { Component, input } from '@angular/core';
import type { FooterProps } from '@lib/print/print.types';

@Component({
    selector: 'lib-print-footer-zh',
    standalone: true,
    template: `
        <footer
            id="footer"
            class="text-xs text-zinc-500 w-full flex justify-between items-center px-8 pt-2"
            data-print-block="true"
            data-print-atomic="true"
        >
            @if (showPageNumbers()) {
                <div class="flex-1 text-center">
                    第 <span data-page-num>{{ pageNum() }}</span> 頁 / 共
                    <span data-total-pages>{{ totalPages() }}</span> 頁
                </div>
            }

            <div class="flex-1 text-right">
                聯絡人：{{ contact()?.id }} {{ contact()?.name }}
            </div>
        </footer>
    `,
})
export class PrintFooterZhComponent {
    readonly contact = input<FooterProps['contact']>();
    readonly pageNum = input(1);
    readonly totalPages = input(1);
    readonly showPageNumbers = input(true);
}
