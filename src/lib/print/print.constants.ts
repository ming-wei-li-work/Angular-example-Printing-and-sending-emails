import type { CompanyInfoList, CompanyKey, PrintLang } from '@lib/print/print.types';
import {
    buildDefaultCompanyInfoList,
    buildPrintCompanyNameMap,
    MOCK_COMPANY_PROFILES,
} from '@lib/mock/company-profiles';

export const DEFAULT_COMPANY_INFO_LIST: CompanyInfoList = buildDefaultCompanyInfoList();

export const safeData = {
    contact: { id: '', name: '' },
    doc: { id: '', date: '', items: [] },
};

export const companyName = buildPrintCompanyNameMap();

export const documentType = {
    'purchase-zh': '採購單',
    'purchase-en': 'Purchase',
    'quotation-zh': '需求單',
    'quotation-en': 'Quotation',
    'contract-zh': '合約單',
    'contract-en': 'Contract',
    'contract-quotation-zh': '合約詢價單',
    'contract-quotation-en': 'Contract Quotation',
};

export interface PrintVersionOption {
    label: string;
    lang: PrintLang;
    logoVariant: CompanyKey;
}

export const PRINT_VERSION_OPTIONS: PrintVersionOption[] = [
    {
        label: `${MOCK_COMPANY_PROFILES.alpha.shortLabel} - 中文版本`,
        lang: 'zh',
        logoVariant: 'alpha',
    },
    {
        label: `${MOCK_COMPANY_PROFILES.alpha.shortLabel} - 英文版本`,
        lang: 'en',
        logoVariant: 'alpha',
    },
    {
        label: `${MOCK_COMPANY_PROFILES.beta.shortLabel} - 中文版本`,
        lang: 'zh',
        logoVariant: 'beta',
    },
    {
        label: `${MOCK_COMPANY_PROFILES.beta.shortLabel} - 英文版本`,
        lang: 'en',
        logoVariant: 'beta',
    },
];

export const safeGetDynamic = <T extends Record<string, string>>(
    obj: T | undefined,
    key?: string | undefined,
    fallback = ''
): string => {
    if (!obj || !key) return fallback;
    return (obj as Record<string, string>)[key] ?? fallback;
};
