import type { TInputValues } from '@lib/types/types';

const DEMO_SELECT_TYPES: Record<string, TInputValues> = {
    VATTypes: [
        { name: '應稅（5%）', value: '2' },
        { name: '零稅率', value: '1' },
        { name: '免稅', value: '0' },
    ],
    tradeTerms: [
        { name: 'FOB', value: 'FOB' },
        { name: 'CIF', value: 'CIF' },
        { name: 'EXW', value: 'EXW' },
    ],
    currencyTypes: [
        { name: '新台幣 (TWD)', value: 'TWD' },
        { name: '美元 (USD)', value: 'USD' },
    ],
    paymentMethods_02: [
        { name: '電匯', value: '1' },
        { name: '支票', value: '2' },
    ],
    paymentPrepayTerm: [
        { name: '月結', value: '1' },
        { name: '次月結', value: '2' },
    ],
    paymentPrepayAmount: [
        { name: '30 天', value: '1' },
        { name: '60 天', value: '2' },
    ],
    default: [{ name: '-', value: '' }],
};

export const parseSelectTypeName = (type: string, value: string): string => {
    const options = DEMO_SELECT_TYPES[type] || DEMO_SELECT_TYPES['default'];
    return options.find(item => item.value === value)?.name || value;
};
