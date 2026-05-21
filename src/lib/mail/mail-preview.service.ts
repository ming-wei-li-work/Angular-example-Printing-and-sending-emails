import { Injectable, signal } from '@angular/core';

import { companyName } from '@lib/mail/mail.constants';
import { MailHtmlService } from '@lib/mail/mail-html.service';
import { cleanMailHTML, getTypeText } from '@lib/mail/mail.utils';
import type { CompanyKey, MailData, MailLang, OrgInfo } from '@lib/mail/mail.types';
import type { DemoContext } from '@lib/mock/demo-context';
import { MOCK_COMPANY_PROFILES } from '@lib/mock/company-profiles';

@Injectable()
export class MailPreviewService {
    private readonly requestToken = signal(0);
    private data: MailData | null = null;
    private context: DemoContext | null = null;

    readonly lang = signal<MailLang>('zh');
    readonly company = signal<CompanyKey>('alpha');
    readonly mailContent = signal('');
    readonly isLoading = signal(true);
    readonly defaultTitle = signal('');

    constructor(private readonly mailHtmlService: MailHtmlService) {}

    async initialize(data: MailData, context: DemoContext, defaultTitle?: string): Promise<void> {
        this.data = data;
        this.context = context;
        this.lang.set('zh');
        this.company.set('alpha');
        this.defaultTitle.set(defaultTitle || getTypeText(data.header.serialNumber || ''));
        await this.refresh();
    }

    async setLang(nextLang: MailLang): Promise<void> {
        this.lang.set(nextLang);
        await this.refresh();
    }

    async setCompany(nextCompany: CompanyKey): Promise<void> {
        this.company.set(nextCompany);
        await this.refresh();
    }

    async refresh(): Promise<void> {
        if (!this.data || !this.context) return;

        const token = this.requestToken() + 1;
        this.requestToken.set(token);
        this.isLoading.set(true);

        try {
            const lang = this.lang();
            const company = this.company();
            const data = this.data;
            const context = this.context;
            const supplierName = data.supplier?.name || '';
            const serialNumber = data.header.serialNumber || '';
            const operator = context.peopleValues[0];
            const operatorDept = context.deptValues[0];
            const { userContact, orgInfoList } = context;
            const companyProfile = MOCK_COMPANY_PROFILES[company];
            const companyInfo: OrgInfo =
                orgInfoList.find(item => item.settings_id === companyProfile.settingsId) || {};

            const body = await this.mailHtmlService.generateMailHTML(
                { lang, data },
                { lang, logoVariant: company, companyInfoVariant: company }
            );

            const phone = userContact.user_number || '';
            const email = userContact.user_email || '';
            const extension = userContact.user_extension || '';
            const tel = companyInfo.settings_tel || '';
            const companyText = companyName[`${company}_${lang}`] || '';

            const commonFooter = [
                companyText,
                `${operator?.name || ''} ${operatorDept?.name || ''}`.trim(),
                ...(tel
                    ? [
                          lang === 'zh'
                              ? `公司電話：${tel}${extension ? ` #${extension}` : ''}`
                              : `Phone: ${tel}${extension ? ` #${extension}` : ''}`,
                      ]
                    : []),
                ...(phone ? [lang === 'zh' ? `電話：${phone}` : `Phone: ${phone}`] : []),
                ...(email ? [lang === 'zh' ? `Email：${email}` : `Email: ${email}`] : []),
            ].join('\n');

            const typeText = getTypeText(serialNumber, lang);
            const templates = {
                zh: cleanMailHTML(`<div contenteditable="true" style="font-family: Arial, Helvetica, sans-serif; line-height:1.5; font-size:14px;">
                    <p style="margin:0 0 12px 0;">※ 此郵件是系統自動發送，請勿直接回覆此郵件！</p>
                    <p style="margin:0 0 12px 0;">${supplierName} 您好，</p>
                    <p style="margin:0 0 12px 0;">隨信附上${typeText}，詳細資訊如下：</p>
                    <div style="margin:0 0 12px 0;">${body}</div>
                    <p style="margin:0 0 12px 0;">如有任何問題，歡迎隨時與我們聯繫。</p>
                    <p style="margin:0 0 12px 0;">祝 商祺</p>
                    <p style="margin:0;">${commonFooter.replace(/\n/g, '<br/>')}</p>
                </div>`),
                en: cleanMailHTML(`<div contenteditable="true" style="font-family: Arial, Helvetica, sans-serif; line-height:1.5; font-size:14px;">
                    <p style="margin:0 0 12px 0;">※ This email was automatically sent by the system. Please do not reply directly to this mail.</p>
                    <p style="margin:0 0 12px 0;">Dear ${supplierName},</p>
                    <p style="margin:0 0 12px 0;">Please find attached the ${typeText} with details as follows:</p>
                    <div style="margin:0 0 12px 0;">${body}</div>
                    <p style="margin:0 0 12px 0;">Should you have any questions, please feel free to contact us at any time.</p>
                    <p style="margin:0 0 12px 0;">Best regards,</p>
                    <p style="margin:0;">${commonFooter.replace(/\n/g, '<br/>')}</p>
                </div>`),
            } as const;

            if (this.requestToken() === token) {
                this.mailContent.set(templates[lang] || templates.zh);
            }
        } finally {
            if (this.requestToken() === token) {
                this.isLoading.set(false);
            }
        }
    }
}
