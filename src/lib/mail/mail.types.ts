/** 寄信模組型別：MailData 供 HTML 模板，MailFormValues 為表單欄位結構 */
import type { PrintItem, PrintSummary } from '@lib/print/print.types';

export type MailLang = 'zh' | 'en';
export type CompanyKey = 'alpha' | 'beta';

export interface MailHeader {
    title: string;
    serialNumber?: string | null;
    project?: string | null;
    date?: string | null;
    expiryDate?: string | null;
    userName?: string | null;
    remark?: string | null;
    email?: string | null;
    phone?: string | null;
}

export interface MailSupplier {
    name?: string;
    serialNumber?: string;
    contactPerson?: string | null;
    contactMobile?: string | null;
    contactEmail?: string | null;
    orderNumber?: string | null;
}

export interface MailPayment {
    vatType?: string;
    currency?: string;
    method?: string;
    cycle?: string;
    term?: string;
    tradeTerm?: string;
    tax_fee?: boolean;
}

/** 郵件 HTML 模板主資料（詢價單 PQ） */
export interface MailData {
    sourceType: 'PQ';
    header: MailHeader;
    supplier?: MailSupplier;
    payment?: MailPayment;
    items?: PrintItem[];
    attachments?: unknown[];
    delivery?: {
        delivery_company_id?: string | null;
        delivery_postcode?: string | null;
        delivery_address?: string[] | null;
    };
    summary?: PrintSummary;
    signature?: Array<Record<string, unknown>>;
}

export interface MailAttachmentForm {
    attachment_id?: string | null;
    attachment_url?: string | null;
    attachment_name?: string | null;
}

/** 寄信表單欄位（對應 React mailSchema，無 Zod 依賴） */
export interface MailFormValues {
    mail_to: string;
    mail_cc?: string | null;
    mail_bcc?: string | null;
    mail_body?: string | null;
    mail_title: string;
    mail_attachment?: MailAttachmentForm | null;
}

export interface EmailAttachment {
    attachment_name: string;
    attachment_id: string;
}

export interface EmailRequest {
    mail_to: string[];
    mail_cc: string[];
    mail_bcc: string[];
    mail_title: string;
    mail_body: string;
    mail_attachments: EmailAttachment[];
}

export interface EmailResponse {
    status: string;
    message: string;
}

/** mock 或真實後端的寄信 API */
export type SendEmailFn = (request: EmailRequest) => Promise<EmailResponse | undefined>;

export interface OrgInfo {
    settings_abbr?: string | null;
    settings_address?: (string | null)[] | null;
    settings_capital?: number | null;
    settings_date_of_establishment?: string | null;
    settings_ex_im_porter_en_name?: string | null;
    settings_id?: string | null;
    settings_intro?: string | null;
    settings_name?: string | null;
    settings_postcode?: string | null;
    settings_representative_name?: string | null;
    settings_salary_transfer_bank_number?: string | null;
    settings_tax_id_number?: string | null;
    settings_tel?: string | null;
    settings_total_female_employees?: number | null;
    settings_total_male_employees?: number | null;
    settings_website?: string | null;
}
