/**
 * Mock API：模擬寄信、使用者聯絡方式與組織資訊查詢（對應 React lib/mock-api.ts）。
 */
import { Injectable } from '@angular/core';

import type { EmailRequest, EmailResponse, OrgInfo } from '@lib/mail/mail.types';
import { orgInfoList, userContact } from '@lib/mock/demo-context';

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

type ContactData = {
    user_id?: string | null;
    user_number?: string | null;
    user_email?: string | null;
    user_extension?: string | null;
};

@Injectable({ providedIn: 'root' })
export class MockApiService {
    async sendEmail(_data: EmailRequest): Promise<EmailResponse> {
        await delay(800);
        return { status: 'ok', message: 'Mock email sent successfully' };
    }

    async getUserContact(_userId: string): Promise<{
        status: string;
        message: string;
        data: ContactData;
    }> {
        await delay(200);
        return {
            status: 'ok',
            message: '',
            data: userContact,
        };
    }

    async getOrgInfo(): Promise<{
        status: string;
        message: string;
        data: OrgInfo[];
    }> {
        await delay(200);
        return {
            status: 'ok',
            message: '',
            data: orgInfoList,
        };
    }
}

/** 與 React 匯出名稱相容的函式別名（可注入 MockApiService 使用） */
export const sendEmailApi = (service: MockApiService, data: EmailRequest) =>
    service.sendEmail(data);
