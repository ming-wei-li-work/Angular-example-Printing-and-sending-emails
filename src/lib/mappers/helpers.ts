/**
 * mapper 共用工具：lookup、明細轉換、詢價單金額彙總。
 * 從 ERP adapter/pricing 層精簡而來，僅保留 quotation demo 所需邏輯。
 */
import type { TInputValues } from '@lib/types/types';

export interface SupplierInfo {
    name?: string;
    serialNumber?: string;
    contactPerson?: string;
    contactMobile?: string;
    contactEmail?: string;
    contactNumber?: string;
    contactFaxNumber?: string;
    [key: string]: unknown;
}

export const cloneSafeData = <T>(data: T): T => {
    try {
        return structuredClone(data);
    } catch {
        return JSON.parse(JSON.stringify(data));
    }
};

export const lookupPersonName = (
    userId: string | undefined,
    peopleValues?: TInputValues
): string | undefined => {
    if (!userId) return undefined;
    return peopleValues?.find(person => person.value === userId)?.name;
};

const parseSupplierDisplay = (displayName: string | undefined) => {
    if (!displayName) return {};
    const [number, ...nameParts] = displayName.split(/\s+/);
    return {
        number,
        name: nameParts.join(' ') || displayName,
    };
};

export const lookupSupplierInfo = <T extends SupplierInfo>(
    supplierId: string | undefined,
    supplierValues?: TInputValues,
    baseInfo: T = {} as T
): T | undefined => {
    if (!supplierId) return Object.keys(baseInfo).length ? baseInfo : undefined;

    const found = supplierValues?.find(supplier => supplier.value === supplierId);
    if (!found) return baseInfo;

    const parsed = parseSupplierDisplay(found.name);

    return {
        ...baseInfo,
        name: parsed.name || found.name,
        serialNumber: (found['serialNumber'] as string | undefined) || parsed.number,
        contactPerson: baseInfo.contactPerson || (found['contactName'] as string | undefined),
        contactMobile: baseInfo.contactMobile || (found['contactMobile'] as string | undefined),
        contactEmail: baseInfo.contactEmail || (found['contactEmail'] as string | undefined),
        contactNumber: found['contactNumber'],
        contactFaxNumber: found['contactFaxNumber'],
    };
};

export const transformItems = <TInput, TOutput>(
    items: TInput[] | null | undefined,
    mapper: (item: TInput, index: number) => TOutput
): TOutput[] => {
    if (!Array.isArray(items)) return [];
    return items.map(mapper);
};

/** 依 PRM 慣例：tax === '2' 為營業稅 5%，其餘 0% */
const resolveTaxRate = (tax: string | null | undefined): number => (tax === '2' ? 0.05 : 0);

const sumDetailLines = (
    details: Array<{ amount?: number | null; count?: number | null }> | null | undefined
): number =>
    details?.reduce((sum, item) => sum + Number(item.amount ?? 0) * Number(item.count ?? 0), 0) ||
    0;

const calcTotals = ({
    initGrandTotal,
    taxRate,
    taxIncluded,
}: {
    initGrandTotal: number;
    taxRate: number;
    taxIncluded: boolean;
}) => {
    if (taxIncluded) {
        const baseSubtotal = initGrandTotal / (1 + taxRate);
        const taxAmount = baseSubtotal * taxRate;
        return { baseTotal: baseSubtotal, total: baseSubtotal + taxAmount };
    }
    const taxAmount = initGrandTotal * taxRate;
    return { baseTotal: initGrandTotal, total: initGrandTotal + taxAmount };
};

/**
 * 詢價單金額彙總：明細加總 → 含/未含稅底稿 → 台幣換算。
 * tax_fee 為 true 時視為含稅總額，先還原未稅再加稅。
 */
export const calculateQuoteSummary = (quote: {
    detail_info?: Array<{ amount?: number | null; count?: number | null }> | null;
    payment_info?: {
        tax?: string | null;
        exchange_rate?: number | string | null;
        tax_fee?: unknown;
    } | null;
    shipping_fee?: number | string | null;
}) => {
    const details = quote?.detail_info || [];
    const taxRate = resolveTaxRate(quote?.payment_info?.tax);
    const rate = Number(quote?.payment_info?.exchange_rate) || 1;
    const shippingFee = Number(quote?.shipping_fee) || 0;
    const taxIncluded = Boolean(quote?.payment_info?.tax_fee);

    const grandTotal = sumDetailLines(details);
    const d = calcTotals({ initGrandTotal: grandTotal, taxRate, taxIncluded });
    const localSubtotal = d.baseTotal;

    return {
        localSubtotal,
        localTotal: d.total,
        shippingFee,
        twdSubtotal: localSubtotal * rate,
        twdTax: (d.total - localSubtotal) * rate,
        twdTotal: d.total * rate + shippingFee,
    };
};

export const transformPaymentInfo = (paymentInfo?: {
    tax?: string | null;
    currency?: string | null;
    pay_method?: string | null;
    pay_cycle?: string | null;
    pay_term?: string | null;
    trade_term?: string | null;
    exchange_rate?: number | string | null;
    tax_fee?: unknown;
} | null) => {
    if (!paymentInfo) return undefined;
    return {
        vatType: paymentInfo.tax ?? undefined,
        currency: paymentInfo.currency ?? undefined,
        method: paymentInfo.pay_method ?? undefined,
        cycle: paymentInfo.pay_cycle ?? undefined,
        term: paymentInfo.pay_term ?? undefined,
        tradeTerm: paymentInfo.trade_term ?? undefined,
        exchange_rate: Number(paymentInfo.exchange_rate) || undefined,
        tax_fee: Boolean(paymentInfo.tax_fee),
    };
};
