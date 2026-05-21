/**
 * Demo 共用 lookup 資料（取代舊 useGlobal / usePRM）。
 * mapper 與 mail 預覽從此取得人員名稱、廠商資訊、聯絡方式、組織設定。
 */
import type { TInputValues } from '@lib/types/types';
import { getMockOrgInfoList, MOCK_COMPANY_PROFILES } from '@lib/mock/company-profiles';

export const MOCK_USER_ID = 'user-demo-001';
export const MOCK_SUPPLIER_ID = 'supplier-demo-001';
export const MOCK_PROJECT_ID = 'project-demo-001';
export const MOCK_DEPT_ID = 'dept-demo-001';

export const peopleValues: TInputValues = [
    {
        name: '示範員工 A',
        value: MOCK_USER_ID,
        workEnd: false,
        leaveWithoutPay: false,
        appointedManager: false,
        superUser: false,
        departmentId: MOCK_DEPT_ID,
    },
];

export const deptValues: TInputValues = [
    {
        name: '示範採購部',
        value: MOCK_DEPT_ID,
    },
];

export const supplierValues: TInputValues = [
    {
        name: 'SUP-001 示範供應商股份有限公司',
        value: MOCK_SUPPLIER_ID,
        serialNumber: 'SUP-001',
        contactName: '示範聯絡人 B',
        contactMobile: '0910-000-000',
        contactEmail: 'supplier@example.com',
    },
];

export const userContact = {
    user_id: MOCK_USER_ID,
    user_number: '00-0000-0000',
    user_email: 'demo.user@example.com',
    user_extension: '000',
};

export const orgInfoList = getMockOrgInfoList();

/** Demo 注入給 mapper / MailButton 的完整 mock 上下文 */
export interface DemoContext {
    peopleValues: TInputValues;
    supplierValues: TInputValues;
    deptValues: TInputValues;
    userContact: typeof userContact;
    orgInfoList: typeof orgInfoList;
}

export const mockDemoContext: DemoContext = {
    peopleValues,
    supplierValues,
    deptValues,
    userContact,
    orgInfoList,
};

export { MOCK_COMPANY_PROFILES };
