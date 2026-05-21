import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { COMPANY_OPTIONS, LANG_OPTIONS, languageType } from '@lib/mail/mail.constants';
import { MailPreviewService } from '@lib/mail/mail-preview.service';
import {
    EMPTY_INVALID_EMAILS,
    getInvalidEmails,
    hasInvalidEmails,
    stringToArray,
    trimMailFileName,
    type InvalidEmails,
} from '@lib/mail/mail.utils';
import type {
    EmailRequest,
    MailData,
    MailFormValues,
    MailLang,
    SendEmailFn,
} from '@lib/mail/mail.types';
import { MockApiService } from '@lib/mock/mock-api.service';
import type { DemoContext } from '@lib/mock/demo-context';

export interface MailDialogData {
    data: MailData;
    context: DemoContext;
    defaultTo?: string;
    defaultTitle?: string;
    onSend?: SendEmailFn;
}

@Component({
    selector: 'lib-mail-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    providers: [MailPreviewService],
    template: `
        <h2 mat-dialog-title>寄送 Email</h2>
        <mat-dialog-content>
            <form [formGroup]="form" class="mail-form">
                <section class="section">
                    <p class="section-title">Email 範本</p>
                    <mat-radio-group
                        [value]="preview.lang()"
                        (change)="handleLangChange($event.value)"
                        class="radio-row"
                        [disabled]="preview.isLoading()"
                    >
                        @for (item of langOptions; track item.id) {
                            <mat-radio-button [value]="item.value">{{ item.label }}</mat-radio-button>
                        }
                    </mat-radio-group>
                </section>

                <section class="section fields">
                    <mat-form-field appearance="outline">
                        <mat-label>收件人 Email</mat-label>
                        <input matInput formControlName="mail_to" />
                        <mat-error>收件人必填</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>副本</mat-label>
                        <input matInput formControlName="mail_cc" />
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>密件副本</mat-label>
                        <input matInput formControlName="mail_bcc" />
                    </mat-form-field>
                </section>

                <mat-form-field appearance="outline">
                    <mat-label>主旨</mat-label>
                    <input matInput formControlName="mail_title" />
                    <mat-error>主旨必填</mat-error>
                </mat-form-field>

                <section class="section">
                    <div class="preview-title">
                        <span>預覽內容</span>
                        @if (preview.isLoading()) {
                            <mat-spinner diameter="18"></mat-spinner>
                        }
                    </div>
                    <iframe class="preview-frame" [srcdoc]="preview.mailContent()" title="mail-preview"></iframe>
                </section>

                <section class="section">
                    <p class="section-title">單據版本</p>
                    <mat-radio-group
                        [value]="preview.company()"
                        (change)="handleCompanyChange($event.value)"
                        class="radio-row"
                        [disabled]="preview.isLoading()"
                    >
                        @for (item of companyOptions; track item.id) {
                            <mat-radio-button [value]="item.value">
                                {{ item.label }} - {{ languageType[preview.lang()] }}
                            </mat-radio-button>
                        }
                    </mat-radio-group>
                </section>

                <section class="section">
                    <p class="section-title">附加檔案</p>
                    <div class="attachment-row">
                        <mat-form-field appearance="outline" class="attachment-name">
                            <mat-label>檔名</mat-label>
                            <input matInput formControlName="attachment_name" readonly />
                        </mat-form-field>
                        <input
                            #attachmentInput
                            type="file"
                            accept="image/*,application/pdf,text/plain"
                            (change)="handleAttachmentSelected($event)"
                            hidden
                        />
                        <button mat-stroked-button type="button" (click)="openAttachmentPicker()" [disabled]="isUploading()">
                            上傳
                        </button>
                        <button mat-stroked-button type="button" (click)="downloadAttachment()">下載</button>
                        <button mat-stroked-button type="button" (click)="clearAttachment()">刪除</button>
                    </div>
                </section>

                @if (hasInvalidEmails(invalidEmails())) {
                    <section class="warning-box">
                        @if (invalidEmails().to.length) {
                            <div>收件人：{{ invalidEmails().to.join(', ') }}</div>
                        }
                        @if (invalidEmails().cc.length) {
                            <div>副本：{{ invalidEmails().cc.join(', ') }}</div>
                        }
                        @if (invalidEmails().bcc.length) {
                            <div>密件副本：{{ invalidEmails().bcc.join(', ') }}</div>
                        }
                        <div class="warning-message">
                            email 可能為錯誤格式或非常見格式，請確認是否繼續寄送？
                        </div>
                        <div class="warning-actions">
                            <button mat-stroked-button type="button" (click)="resetInvalidWarning()">取消</button>
                            <button mat-flat-button type="button" (click)="confirmInvalidWarning()">繼續寄送</button>
                        </div>
                    </section>
                }
            </form>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-stroked-button type="button" (click)="handleClose()">取消</button>
            <button
                mat-flat-button
                type="button"
                (click)="handleSubmit()"
                [disabled]="isSubmitting() || preview.isLoading() || form.invalid"
            >
                傳送
            </button>
        </mat-dialog-actions>
    `,
    styles: `
        .mail-form { display: flex; flex-direction: column; gap: 16px; min-width: 820px; max-width: 100%; }
        .section { display: flex; flex-direction: column; gap: 8px; }
        .section-title { font-size: 13px; font-weight: 600; color: #334155; margin: 0; }
        .radio-row { display: flex; gap: 20px; flex-wrap: wrap; }
        .fields { gap: 10px; }
        .preview-title { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #334155; }
        .preview-frame { width: 100%; min-height: 320px; border: 1px solid #d6dce3; border-radius: 8px; background: #fff; }
        .attachment-row { display: flex; gap: 8px; align-items: center; }
        .attachment-name { flex: 1; }
        .warning-box { border: 1px solid #fecaca; background: #fef2f2; border-radius: 8px; padding: 12px; color: #991b1b; }
        .warning-message { margin-top: 6px; font-weight: 600; }
        .warning-actions { margin-top: 10px; display: flex; justify-content: flex-end; gap: 8px; }
    `,
})
export class MailDialogComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    protected readonly preview = inject(MailPreviewService);
    private readonly mockApi = inject(MockApiService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialogRef = inject(MatDialogRef<MailDialogComponent>, { optional: true });
    private readonly dialogData = inject<MailDialogData | null>(MAT_DIALOG_DATA, { optional: true });

    readonly data = input<MailData | undefined>(undefined);
    readonly context = input<DemoContext | undefined>(undefined);
    readonly defaultTo = input<string | undefined>(undefined);
    readonly defaultTitle = input<string | undefined>(undefined);
    readonly onSend = input<SendEmailFn | undefined>(undefined);

    @ViewChild('attachmentInput') attachmentInput?: ElementRef<HTMLInputElement>;

    readonly langOptions = LANG_OPTIONS;
    readonly companyOptions = COMPANY_OPTIONS;
    readonly languageType = languageType;
    readonly hasInvalidEmails = hasInvalidEmails;
    readonly invalidEmails = signal<InvalidEmails>(EMPTY_INVALID_EMAILS);
    readonly isSubmitting = signal(false);
    readonly isUploading = signal(false);

    private pendingRequest: EmailRequest | null = null;

    readonly form = this.fb.nonNullable.group({
        mail_to: ['', [Validators.required]],
        mail_cc: [''],
        mail_bcc: [''],
        mail_title: ['', [Validators.required]],
        attachment_id: [''],
        attachment_name: [''],
    });

    ngOnInit(): void {
        const data = this.dialogData?.data || this.data();
        const context = this.dialogData?.context || this.context();
        if (!data || !context) {
            throw new Error('MailDialogComponent requires MailData and DemoContext.');
        }

        const to = this.dialogData?.defaultTo ?? this.defaultTo() ?? '';
        const title = this.dialogData?.defaultTitle ?? this.defaultTitle();
        this.form.patchValue({ mail_to: to });

        void this.preview.initialize(data, context, title).then(() => {
            if (!this.form.controls.mail_title.value) {
                this.form.patchValue({ mail_title: this.preview.defaultTitle() });
            }
        });
    }

    handleLangChange(value: MailLang): void {
        void this.preview.setLang(value);
    }

    handleCompanyChange(value: 'alpha' | 'beta'): void {
        void this.preview.setCompany(value);
    }

    openAttachmentPicker(): void {
        this.attachmentInput?.nativeElement.click();
    }

    async handleAttachmentSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
        if (!acceptedTypes.includes(file.type)) {
            this.clearAttachment();
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            this.clearAttachment();
            return;
        }

        this.isUploading.set(true);
        await new Promise<void>(resolve => setTimeout(resolve, 600));

        this.form.patchValue({
            attachment_id: `mock-file-${Date.now()}`,
            attachment_name: trimMailFileName(file.name),
        });
        this.isUploading.set(false);
        input.value = '';
    }

    clearAttachment(): void {
        this.form.patchValue({
            attachment_id: '',
            attachment_name: '',
        });
    }

    downloadAttachment(): void {
        const fileName = this.form.controls.attachment_name.value || 'attachment.txt';
        const blob = new Blob(['Mock attachment download content'], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    handleClose(): void {
        this.dialogRef?.close(false);
    }

    handleSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const values = this.form.getRawValue() as MailFormValues & {
            attachment_id?: string;
            attachment_name?: string;
        };
        const param: EmailRequest = {
            mail_to: stringToArray(values.mail_to),
            mail_cc: stringToArray(values.mail_cc),
            mail_bcc: stringToArray(values.mail_bcc),
            mail_title: values.mail_title,
            mail_body: this.preview.mailContent(),
            mail_attachments: values.attachment_id
                ? [{ attachment_id: values.attachment_id, attachment_name: values.attachment_name || '' }]
                : [],
        };

        const invalid = getInvalidEmails(param);
        if (hasInvalidEmails(invalid)) {
            this.pendingRequest = param;
            this.invalidEmails.set(invalid);
            return;
        }

        void this.sendEmail(param);
    }

    resetInvalidWarning(): void {
        this.pendingRequest = null;
        this.invalidEmails.set(EMPTY_INVALID_EMAILS);
    }

    confirmInvalidWarning(): void {
        if (!this.pendingRequest) return;
        const request = this.pendingRequest;
        this.resetInvalidWarning();
        void this.sendEmail(request);
    }

    private async sendEmail(param: EmailRequest): Promise<void> {
        this.isSubmitting.set(true);
        try {
            const sender = this.dialogData?.onSend || this.onSend() || this.mockApi.sendEmail.bind(this.mockApi);
            const result = await sender(param);
            if (result?.status === 'ok') {
                this.snackBar.open('操作成功', undefined, { duration: 3000 });
                this.dialogRef?.close(true);
            }
        } finally {
            this.isSubmitting.set(false);
        }
    }
}
