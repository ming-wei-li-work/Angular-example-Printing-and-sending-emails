export { MailButtonComponent } from '@lib/mail/mail-button.component';
export { MailDialogComponent } from '@lib/mail/mail-dialog.component';
export { MailHtmlService } from '@lib/mail/mail-html.service';
export { MailPreviewService } from '@lib/mail/mail-preview.service';
export { QuotationMailZhComponent } from '@lib/mail/templates/quotation-mail-zh.component';
export { QuotationMailEnComponent } from '@lib/mail/templates/quotation-mail-en.component';
export { COMPANY_OPTIONS, companyName, LANG_OPTIONS, languageType, TYPE_TEXT } from '@lib/mail/mail.constants';
export {
    cleanMailHTML,
    EMPTY_INVALID_EMAILS,
    getInvalidEmails,
    getTypeText,
    hasInvalidEmails,
    stringToArray,
    trimMailFileName,
} from '@lib/mail/mail.utils';
export type {
    CompanyKey,
    EmailAttachment,
    EmailRequest,
    EmailResponse,
    MailAttachmentForm,
    MailData,
    MailFormValues,
    MailHeader,
    MailLang,
    MailPayment,
    MailSupplier,
    OrgInfo,
    SendEmailFn,
} from '@lib/mail/mail.types';
