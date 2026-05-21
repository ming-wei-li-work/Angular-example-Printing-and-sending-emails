/**
 * Mock 公司主檔：Alpha / Beta 示範組織，供列印 Logo、頁首頁尾與 mail 公司名稱對照。
 */
export type MockCompanyKey = 'alpha' | 'beta';

export interface MockCompanyProfile {
    settingsId: string;
    zhName: string;
    enName: string;
    addressZh: string;
    addressEn: string;
    taxId: string;
    tel: string;
    fax: string;
    shortLabel: string;
}

export const MOCK_COMPANY_PROFILES: Record<MockCompanyKey, MockCompanyProfile> = {
    alpha: {
        settingsId: '00000000-0000-4000-8000-000000000001',
        zhName: 'Alpha 示範股份有限公司',
        enName: 'Alpha Demo Corporation',
        addressZh: '00000 示範市示範區示範路 1 號',
        addressEn: '1 Demo Road, Demo District, Demo City 00000',
        taxId: '00000001',
        tel: '(00)000-0000',
        fax: '(00)000-0001',
        shortLabel: 'Alpha',
    },
    beta: {
        settingsId: '00000000-0000-4000-8000-000000000002',
        zhName: 'Beta 示範股份有限公司',
        enName: 'Beta Demo Corporation',
        addressZh: '00000 示範市示範區示範路 2 號',
        addressEn: '2 Demo Road, Demo District, Demo City 00000',
        taxId: '00000002',
        tel: '(00)000-0002',
        fax: '(00)000-0003',
        shortLabel: 'Beta',
    },
};

export const MOCK_COMPANY_KEYS = Object.keys(MOCK_COMPANY_PROFILES) as MockCompanyKey[];

export const getMockOrgInfoList = () =>
    MOCK_COMPANY_KEYS.map(key => {
        const profile = MOCK_COMPANY_PROFILES[key];
        return {
            settings_id: profile.settingsId,
            settings_name: profile.zhName,
            settings_tel: profile.tel,
        };
    });

export const buildDefaultCompanyInfoList = () => ({
    alpha_zh: {
        zhName: MOCK_COMPANY_PROFILES.alpha.zhName,
        enName: MOCK_COMPANY_PROFILES.alpha.enName,
        address: MOCK_COMPANY_PROFILES.alpha.addressZh,
        taxId: MOCK_COMPANY_PROFILES.alpha.taxId,
        tel: MOCK_COMPANY_PROFILES.alpha.tel,
        fax: MOCK_COMPANY_PROFILES.alpha.fax,
    },
    alpha_en: {
        zhName: '',
        enName: MOCK_COMPANY_PROFILES.alpha.enName,
        address: MOCK_COMPANY_PROFILES.alpha.addressEn,
        taxId: MOCK_COMPANY_PROFILES.alpha.taxId,
        tel: MOCK_COMPANY_PROFILES.alpha.tel,
        fax: MOCK_COMPANY_PROFILES.alpha.fax,
    },
    beta_zh: {
        zhName: MOCK_COMPANY_PROFILES.beta.zhName,
        enName: MOCK_COMPANY_PROFILES.beta.enName,
        address: MOCK_COMPANY_PROFILES.beta.addressZh,
        taxId: MOCK_COMPANY_PROFILES.beta.taxId,
        tel: MOCK_COMPANY_PROFILES.beta.tel,
        fax: MOCK_COMPANY_PROFILES.beta.fax,
    },
    beta_en: {
        zhName: '',
        enName: MOCK_COMPANY_PROFILES.beta.enName,
        address: MOCK_COMPANY_PROFILES.beta.addressEn,
        taxId: MOCK_COMPANY_PROFILES.beta.taxId,
        tel: MOCK_COMPANY_PROFILES.beta.tel,
        fax: MOCK_COMPANY_PROFILES.beta.fax,
    },
});

export const buildMailCompanyNameMap = () => ({
    alpha_zh: MOCK_COMPANY_PROFILES.alpha.zhName,
    alpha_en: MOCK_COMPANY_PROFILES.alpha.enName,
    beta_zh: MOCK_COMPANY_PROFILES.beta.zhName,
    beta_en: MOCK_COMPANY_PROFILES.beta.enName,
});

export const buildPrintCompanyNameMap = () => ({
    'alpha-zh': MOCK_COMPANY_PROFILES.alpha.zhName,
    'alpha-en': MOCK_COMPANY_PROFILES.alpha.shortLabel,
    'beta-zh': MOCK_COMPANY_PROFILES.beta.zhName,
    'beta-en': MOCK_COMPANY_PROFILES.beta.shortLabel,
});
