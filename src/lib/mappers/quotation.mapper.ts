/**
 * 詢價單 → PrintData / MailData 轉換。
 * 輸入：MaterialQuoteEdit + DemoContext（人員/廠商 lookup）。
 * 輸出：列印/寄信模板可直接消費的結構化資料。
 */
import type { PrintData } from '@lib/print/print.types';
import type { MailData } from '@lib/mail/mail.types';
import type { DemoContext } from '@lib/mock/demo-context';
import type { MaterialQuoteEdit } from '@lib/mock/quotation.schema';

import {
    calculateQuoteSummary,
    cloneSafeData,
    lookupPersonName,
    lookupSupplierInfo,
    transformItems,
    transformPaymentInfo,
} from '@lib/mappers/helpers';

/** 詢價單 mock JSON → 列印模板 PrintData */
export const mapQuotationToPrintData = (
    quotation: MaterialQuoteEdit,
    context: DemoContext
): PrintData | undefined => {
    if (!quotation) return undefined;

    const safeQuote = cloneSafeData(quotation);
    const { supplierValues, peopleValues, userContact } = context;

    const header = {
        title: '詢價單',
        serialNumber: safeQuote.quote_info?.serial_number,
        project: safeQuote.quote_info?.project_record_id,
        date: safeQuote.quote_info?.recorder_date ?? undefined,
        expiryDate: safeQuote.quote_info?.quote_end_date ?? undefined,
        userName:
            safeQuote.quote_info?.applicant
                ? lookupPersonName(safeQuote.quote_info.applicant, peopleValues) ||
                  safeQuote.quote_info.applicant
                : undefined,
        remark: safeQuote.quote_info?.remark ?? undefined,
        email: userContact.user_email ?? undefined,
        phone: userContact.user_number ?? undefined,
    };

    const baseSupplierInfo = {
        contactPerson: safeQuote.supplier_info?.person ?? undefined,
        contactMobile: safeQuote.supplier_info?.mobile ?? undefined,
        contactEmail: safeQuote.supplier_info?.email ?? undefined,
        orderNumber: safeQuote.supplier_info?.orig_order_number ?? undefined,
    };

    const supplier = lookupSupplierInfo(
        safeQuote.supplier_info?.supplier_id,
        supplierValues,
        baseSupplierInfo
    );

    const items = transformItems(safeQuote.detail_info || [], item => ({
        id: item.item_id,
        name: item.item_name,
        spec: item.spec,
        brand: item.brand,
        qty: item.count,
        unit: item.unit,
        amount: item.amount,
        totalAmount: Number(item.count || 0) * Number(item.amount || 0),
        remark: item.remark,
    }));

    return {
        sourceType: 'PQ',
        header,
        supplier,
        payment: transformPaymentInfo(safeQuote.payment_info),
        items,
        attachments: safeQuote.attachment || [],
        delivery: safeQuote.delivery_info
            ? {
                  company: safeQuote.delivery_info.delivery_company_id ?? undefined,
                  postcode: safeQuote.delivery_info.delivery_postcode ?? undefined,
                  address: safeQuote.delivery_info.delivery_address?.map(a => a ?? '') ?? undefined,
              }
            : undefined,
        summary: calculateQuoteSummary(safeQuote),
    };
};

/** 詢價單 mock JSON → 郵件模板 MailData */
export const mapQuotationToMailData = (
    quotation: MaterialQuoteEdit,
    context: DemoContext
): MailData | undefined => {
    if (!quotation) return undefined;

    const safeQuote = cloneSafeData(quotation);
    const { supplierValues, peopleValues, userContact } = context;

    return {
        sourceType: 'PQ',
        header: {
            title: '詢價單',
            serialNumber: safeQuote.quote_info?.serial_number,
            project: safeQuote.quote_info?.project_record_id,
            date: safeQuote.quote_info?.recorder_date,
            expiryDate: safeQuote.quote_info?.quote_end_date,
            userName:
                lookupPersonName(safeQuote.quote_info?.applicant, peopleValues) ||
                safeQuote.quote_info?.applicant,
            remark: safeQuote.quote_info?.remark,
            email: userContact.user_email,
            phone: userContact.user_number,
        },
        supplier: lookupSupplierInfo(
            safeQuote.supplier_info?.supplier_id ?? undefined,
            supplierValues,
            {
                contactPerson: safeQuote.supplier_info?.person ?? undefined,
                contactMobile: safeQuote.supplier_info?.mobile ?? undefined,
                contactEmail: safeQuote.supplier_info?.email ?? undefined,
                orderNumber: safeQuote.supplier_info?.orig_order_number ?? undefined,
            }
        ),
        payment: transformPaymentInfo(safeQuote.payment_info),
        items: transformItems(safeQuote.detail_info || [], item => ({
            id: item.item_id,
            name: item.item_name,
            spec: item.spec,
            brand: item.brand,
            qty: item.count,
            unit: item.unit,
            amount: item.amount,
            totalAmount: Number(item.count || 0) * Number(item.amount || 0),
            remark: item.remark,
        })),
        attachments: safeQuote.attachment || [],
        delivery: safeQuote.delivery_info
            ? {
                  delivery_company_id: safeQuote.delivery_info.delivery_company_id,
                  delivery_postcode: safeQuote.delivery_info.delivery_postcode,
                  delivery_address: safeQuote.delivery_info.delivery_address?.map(a => a ?? '') ?? null,
              }
            : undefined,
        summary: calculateQuoteSummary(safeQuote),
    };
};
