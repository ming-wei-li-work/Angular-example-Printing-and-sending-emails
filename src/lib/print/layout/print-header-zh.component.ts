import { Component, input } from '@angular/core';
import { CompanyLogoComponent } from '@lib/print/layout/company-logo.component';
import type { CompanyInfoItem, CompanyKey } from '@lib/print/print.types';

@Component({
    selector: 'lib-print-header-zh',
    standalone: true,
    imports: [CompanyLogoComponent],
    template: `
        <header
            id="header"
            class="print-header bg-white min-w-screen min-h-32 overflow-visible relative border-none"
            data-print-block="true"
            data-print-atomic="true"
        >
            <div
                class="flex flex-row items-start justify-between w-full px-6"
                style="position: absolute; top: 33px; left: 0; right: 0;"
            >
                @if (headerLogoUrl()) {
                    <img [src]="headerLogoUrl()" alt="Logo" class="h-10 object-contain" />
                } @else {
                    <lib-company-logo [variant]="logoVariant()" [width]="142" [height]="37" />
                }

                <div class="text-[10px] text-zinc-700 leading-[1.2em] w-[211px] h-15 text-right">
                    <p>
                        {{ headerCompanyInfo()?.zhName }}
                        {{ headerCompanyInfo()?.enName }}
                    </p>
                    <p>{{ headerCompanyInfo()?.address }}</p>
                    <p>統一編號：{{ headerCompanyInfo()?.taxId }}</p>
                    <p>
                        Tel: {{ headerCompanyInfo()?.tel }} Fax: {{ headerCompanyInfo()?.fax }}
                    </p>
                </div>
            </div>
        </header>
    `,
})
export class PrintHeaderZhComponent {
    readonly logoVariant = input<CompanyKey>('alpha');
    readonly headerLogoUrl = input<string | undefined>(undefined);
    readonly headerCompanyInfo = input<CompanyInfoItem | undefined>(undefined);
}
