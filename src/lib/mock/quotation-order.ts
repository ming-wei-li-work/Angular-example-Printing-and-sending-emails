/**
 * Mock 詢價單單據資料，供列印／寄信 demo 載入。
 */
import type { MaterialQuoteEdit } from '@lib/mock/quotation.schema';
import { MOCK_COMPANY_PROFILES } from '@lib/mock/company-profiles';
import {
    MOCK_PROJECT_ID,
    MOCK_SUPPLIER_ID,
    MOCK_USER_ID,
} from '@lib/mock/demo-context';

export const mockQuotationOrder: MaterialQuoteEdit = {
    quote_id: 'quote-demo-001',
    status: '1',
    drop_reason: null,
    shipping_fee: 500,
    quote_info: {
        recorder_date: '2026-05-15',
        applicant: MOCK_USER_ID,
        serial_number: 'PQ-DEMO-0001',
        already_order_array: [],
        from_request_array: [],
        project_record_id: MOCK_PROJECT_ID,
        quote_end_date: '2026-05-30',
        remark: '此為 mock 詢價單，所有資料均為虛構示範用途。',
    },
    supplier_info: {
        supplier_id: MOCK_SUPPLIER_ID,
        person: '示範聯絡人 B',
        mobile: '0910-000-000',
        email: 'supplier@example.com',
        orig_order_number: 'SUP-001',
    },
    delivery_info: {
        delivery_company_id: MOCK_COMPANY_PROFILES.alpha.zhName,
        delivery_postcode: '00000',
        delivery_address: ['示範市', '示範區', '示範路 100 號'],
    },
    detail_info: [
        {
            item_id: 'item-001',
            item_number: 'DEMO-001',
            item_name: '示範物料 A',
            brand: '示範牌',
            spec: '規格 A',
            count: 100,
            unit: '個',
            amount: 15,
            remark: '',
        },
        {
            item_id: 'item-002',
            item_number: 'DEMO-002',
            item_name: '示範物料 B',
            brand: '示範牌',
            spec: '規格 B',
            count: 50,
            unit: '組',
            amount: 80,
            remark: '示範備註',
        },
        {
            item_id: 'item-003',
            item_number: 'DEMO-003',
            item_name: '示範物料 C',
            brand: '示範牌',
            spec: '規格 C',
            count: 20,
            unit: '件',
            amount: 250,
            remark: '',
        },
    ],
    payment_info: {
        tax: '2',
        tax_fee: true,
        currency: 'TWD',
        exchange_rate: 1,
        pay_method: '1',
        pay_cycle: '1',
        pay_term: '1',
        trade_term: 'FOB',
    },
    attachment: [],
    pq_total: {
        localSubtotal: 9500,
        localTotal: 9975,
        shippingFee: 500,
        twdSubtotal: 9500,
        twdTax: 475,
        twdTotal: 10475,
    },
};

export const MOCK_ORDER_ID = mockQuotationOrder.quote_info.serial_number ?? 'PQ-DEMO-0001';
