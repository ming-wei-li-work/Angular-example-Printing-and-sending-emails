import { TYPE_TEXT } from '@lib/mail/mail.constants';
import type { EmailRequest, MailLang } from '@lib/mail/mail.types';

export interface InvalidEmails {
    to: string[];
    cc: string[];
    bcc: string[];
}

export const EMPTY_INVALID_EMAILS: InvalidEmails = {
    to: [],
    cc: [],
    bcc: [],
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getTypeText = (orderId?: string, lang: MailLang = 'zh'): string => {
    const text = lang === 'zh' ? TYPE_TEXT.zh : TYPE_TEXT.en;
    return orderId ? `${text} ${orderId}`.trim() : text;
};

export const cleanMailHTML = (html: string): string =>
    html
        .trim()
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ');

export const stringToArray = (value: string | null | undefined): string[] =>
    value
        ?.split(',')
        .map(item => item.trim())
        .filter(Boolean) || [];

export const getInvalidEmails = (param: EmailRequest): InvalidEmails => ({
    to: param.mail_to.filter(email => !emailRegex.test(email)),
    cc: param.mail_cc.filter(email => !emailRegex.test(email)),
    bcc: param.mail_bcc.filter(email => !emailRegex.test(email)),
});

export const hasInvalidEmails = (invalidEmails: InvalidEmails): boolean =>
    Boolean(invalidEmails.to.length || invalidEmails.cc.length || invalidEmails.bcc.length);

export const trimMailFileName = (fileName: string): string =>
    fileName.length > 20 ? `${fileName.slice(0, 17)}...` : fileName;
