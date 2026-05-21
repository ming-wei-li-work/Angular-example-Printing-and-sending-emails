import { Component, input } from '@angular/core';
import type { FooterProps } from '@lib/print/print.types';

@Component({
    selector: 'lib-print-footer-en',
    standalone: true,
    template: `
        <footer
            id="footer"
            class="text-xs text-zinc-500 w-full flex justify-between items-center px-8 pt-2 pb-4"
            data-print-block="true"
            data-print-atomic="true"
        >
            @if (showPageNumbers()) {
                <div class="flex-1 text-right">
                    Page <span data-page-num>{{ pageNum() }}</span> of
                    <span data-total-pages>{{ totalPages() }}</span>
                </div>
            }

            <div class="flex-1 text-right">
                Contact：{{ contact()?.id }} {{ contact()?.name }}
            </div>
        </footer>
    `,
})
export class PrintFooterEnComponent {
    readonly contact = input<FooterProps['contact']>();
    readonly pageNum = input(1);
    readonly totalPages = input(1);
    readonly showPageNumbers = input(true);
}
