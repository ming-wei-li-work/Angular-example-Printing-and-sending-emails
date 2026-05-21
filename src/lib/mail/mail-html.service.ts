import { Injectable, Type } from '@angular/core';

import type { CompanyKey, MailData, MailLang } from '@lib/mail/mail.types';
import { QuotationMailEnComponent } from '@lib/mail/templates/quotation-mail-en.component';
import { QuotationMailZhComponent } from '@lib/mail/templates/quotation-mail-zh.component';
import { ComponentRenderService } from '@lib/shared/component-render.service';

export interface MailRenderOptions {
    lang: MailLang;
    data: MailData;
}

export interface MailRenderSettings {
    lang?: MailLang;
    logoVariant?: CompanyKey;
    companyInfoVariant?: CompanyKey;
}

@Injectable({ providedIn: 'root' })
export class MailHtmlService {
    constructor(private readonly componentRender: ComponentRenderService) {}

    async generateMailHTML({ lang, data }: MailRenderOptions, settings?: MailRenderSettings): Promise<string> {
        const language = settings?.lang || lang || 'zh';
        const templateComponent = this.getTemplateComponent(language);
        if (!templateComponent) {
            throw new Error('無法載入模板');
        }
        return this.componentRender.getInnerHtml(templateComponent, { data });
    }

    private getTemplateComponent(lang: MailLang): Type<object> | null {
        switch (lang) {
            case 'zh':
                return QuotationMailZhComponent;
            case 'en':
                return QuotationMailEnComponent;
            default:
                return null;
        }
    }
}
