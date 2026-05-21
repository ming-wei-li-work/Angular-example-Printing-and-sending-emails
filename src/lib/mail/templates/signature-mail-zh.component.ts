import { Component, computed, input } from '@angular/core';

import type { MailData } from '@lib/mail/mail.types';

type SignatureRow = {
    name?: string | null;
    record_user?: string | null;
    date?: string | null;
    record_approval_time?: string | null;
    image?: string | null;
    sign_image?: string | null;
    department?: string;
    title?: string;
};

@Component({
    selector: 'lib-signature-mail-zh',
    standalone: true,
    template: `
        @if (signatures().length) {
            <tr>
                <td [style]="cellPadding">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" [style]="tableCollapse">
                        <tbody>
                            <tr>
                                <td [style]="titleStyle">簽名欄</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" [style]="fixedTable">
                                        <tbody>
                                            <tr [style]="rowTop">
                                                @for (sig of signatures(); track $index; let idx = $index) {
                                                    <td [style]="sigCell(idx, signatures().length)">
                                                        <div [style]="sigBlock">
                                                            <div [style]="lineHeight">
                                                                @if (sig.department || sig.title) {
                                                                    <div [style]="deptStyle">
                                                                        {{ sig.department }} {{ sig.title }}
                                                                    </div>
                                                                }
                                                                <div [style]="nowrap">
                                                                    <span [style]="nameStyle">{{ sig.name }}</span>
                                                                    <span [style]="dateStyle">{{ sig.date }}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div [style]="lineBox">
                                                            @if (sig.image) {
                                                                <img
                                                                    [src]="sig.image"
                                                                    [alt]="sig.name"
                                                                    [style]="imgStyle"
                                                                />
                                                            } @else {
                                                                <div [style]="imgPlaceholder"></div>
                                                            }
                                                        </div>
                                                    </td>
                                                }
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        }
    `,
})
export class SignatureMailZhComponent {
    readonly data = input.required<MailData>();

    readonly signatures = computed(() => {
        const rows = this.data().signature;
        if (!rows?.length) return [];
        return rows.map((item: SignatureRow) => ({
            department: item.department || '',
            title: item.title || '',
            name: item.name || item.record_user || '',
            date:
                item.date || item.record_approval_time
                    ? new Date(item.date || item.record_approval_time || '').toLocaleDateString('zh-TW')
                    : '',
            image: item.image || item.sign_image || '',
        }));
    });

    readonly cellPadding = { padding: '16px 12px' };
    readonly tableCollapse = { borderCollapse: 'collapse' };
    readonly titleStyle = {
        fontSize: '14px',
        fontWeight: '700',
        paddingBottom: '12px',
        color: '#333',
    };
    readonly fixedTable = { tableLayout: 'fixed', width: '100%' };
    readonly rowTop = { verticalAlign: 'top' };
    readonly sigBlock = { minHeight: '45px', marginBottom: '8px' };
    readonly lineHeight = { lineHeight: '1.2' };
    readonly deptStyle = { fontSize: '10px', color: '#888', marginBottom: '4px' };
    readonly nowrap = { whiteSpace: 'nowrap' };
    readonly nameStyle = { fontSize: '13px', fontWeight: '600', color: '#333', marginRight: '8px' };
    readonly dateStyle = { fontSize: '11px', color: '#999' };
    readonly lineBox = { borderBottom: '1px solid #000', textAlign: 'center' };
    readonly imgStyle = {
        display: 'block',
        width: 'auto',
        maxWidth: '100px',
        height: '50px',
        objectFit: 'contain',
        margin: '0 auto 4px auto',
    };
    readonly imgPlaceholder = { height: '50px' };

    sigCell(idx: number, total: number): Record<string, string> {
        return {
            padding: '0 8px 12px 8px',
            borderRight: idx < total - 1 ? '1px solid #eeeeee' : 'none',
            verticalAlign: 'top',
        };
    }
}
