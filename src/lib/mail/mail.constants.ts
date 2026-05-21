import { buildMailCompanyNameMap, MOCK_COMPANY_PROFILES } from '@lib/mock/company-profiles';

export const companyName = buildMailCompanyNameMap();

export const languageType = {
    zh: '中文版本',
    en: '英文版本',
} as const;

export const TYPE_TEXT = {
    zh: '詢價單',
    en: 'Request for Quotation',
} as const;

interface OptionItem {
    id: string;
    value: string;
    label: string;
}

export const LANG_OPTIONS: OptionItem[] = [
    { id: 'langZh', value: 'zh', label: '中文' },
    { id: 'langEn', value: 'en', label: '英文' },
];

export const COMPANY_OPTIONS: OptionItem[] = [
    {
        id: 'alpha',
        value: 'alpha',
        label: MOCK_COMPANY_PROFILES.alpha.shortLabel,
    },
    {
        id: 'beta',
        value: 'beta',
        label: MOCK_COMPANY_PROFILES.beta.shortLabel,
    },
];
