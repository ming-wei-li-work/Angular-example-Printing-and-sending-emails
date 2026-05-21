import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MailDialogComponent } from '@lib/mail/mail-dialog.component';
import type { MailData, SendEmailFn } from '@lib/mail/mail.types';
import type { DemoContext } from '@lib/mock/demo-context';

@Component({
    selector: 'lib-mail-button',
    standalone: true,
    imports: [MatButtonModule, MatDialogModule, MatIconModule],
    template: `
        <button mat-stroked-button (click)="openDialog()" [disabled]="loading()">
            <mat-icon>mail</mat-icon>
            {{ buttonTitle() }}
        </button>
    `,
})
export class MailButtonComponent {
    private readonly dialog = inject(MatDialog);

    readonly data = input.required<MailData>();
    readonly context = input.required<DemoContext>();
    readonly defaultTo = input('');
    readonly defaultTitle = input<string | undefined>(undefined);
    readonly onSend = input<SendEmailFn | undefined>(undefined);
    readonly buttonTitle = input('寄 Email');
    readonly loading = input(false);

    openDialog(): void {
        if (this.loading()) return;
        this.dialog.open(MailDialogComponent, {
            width: '960px',
            maxWidth: '95vw',
            data: {
                data: this.data(),
                context: this.context(),
                defaultTo: this.defaultTo(),
                defaultTitle: this.defaultTitle(),
                onSend: this.onSend(),
            },
        });
    }
}
