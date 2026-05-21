import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { PrintEngineService } from '@lib/print/print-engine.service';
import { PRINT_VERSION_OPTIONS } from '@lib/print/print.constants';
import type { PrintData, PrintSettings } from '@lib/print/print.types';

@Component({
    selector: 'lib-print-button',
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
    template: `
        <button mat-stroked-button [matMenuTriggerFor]="menu" [disabled]="loading()">
            <mat-icon>print</mat-icon>
            列印
        </button>

        <mat-menu #menu="matMenu">
            @for (option of printVersionOptions; track option.logoVariant + '-' + option.lang; let i = $index) {
                @if (i === 2) {
                    <mat-divider></mat-divider>
                }
                <button mat-menu-item (click)="handlePrint(option.lang, option.logoVariant)">
                    {{ option.label }}
                </button>
            }
        </mat-menu>
    `,
})
export class PrintButtonComponent {
    private readonly printEngineService = inject(PrintEngineService);

    readonly data = input.required<PrintData>();
    readonly loading = input(false);
    readonly printVersionOptions = PRINT_VERSION_OPTIONS;

    handlePrint(lang: 'zh' | 'en', logoVariant: 'alpha' | 'beta'): void {
        if (this.loading()) return;
        const settings: PrintSettings = {
            lang,
            logoVariant,
            companyInfoVariant: logoVariant,
        };
        void this.printEngineService.openPrint({ type: 'quotation', lang, data: this.data() }, settings);
    }
}
