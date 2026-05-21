import type { MailData, MailHeader, MailPayment, MailSupplier } from '@lib/mail/mail.types';
import { parseSelectTypeName as parseSelectTypeNameBase } from '@lib/shared/select.util';

export const parseSelectTypeName = (
    type: Parameters<typeof parseSelectTypeNameBase>[0],
    value?: string | null
): string => parseSelectTypeNameBase(type, value ?? '');

export const fmtNum = (n: string | number | null | undefined): string =>
    n === undefined || n === null ? '-' : typeof n === 'number' ? n.toLocaleString() : String(n);

export function getInfo(key: 'header', data: MailData): MailHeader;
export function getInfo(key: 'supplier', data: MailData): MailSupplier;
export function getInfo(key: 'payment', data: MailData): MailPayment;
export function getInfo(
    key: 'header' | 'payment' | 'supplier',
    data: MailData
): MailHeader | MailSupplier | MailPayment {
    switch (key) {
        case 'header':
            return data.header;
        case 'payment':
            return data.payment || {};
        case 'supplier':
            return data.supplier || {};
        default:
            return {};
    }
}
