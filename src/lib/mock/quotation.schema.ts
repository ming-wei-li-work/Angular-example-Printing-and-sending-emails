/**
 * 詢價單（Material Quote Edit）型別定義，對應 React example/schemas/quotation Zod schema。
 */

export interface DetailInfo {
    purchase_detail_id?: string | null;
    item_id?: string | null;
    item_number?: string | null;
    item_name?: string | null;
    brand?: string | null;
    spec?: string | null;
    count?: number | null;
    unit?: string | null;
    amount?: number | null;
    remark?: string | null;
}

export interface QuoteOrderRef {
    serial_number?: string | null;
    purchase_order_id?: string | null;
}

export interface MaterialQuoteEdit {
    quote_id: string;
    status?: string | null;
    drop_reason?: string | null;
    shipping_fee?: number | null;
    quote_info: {
        recorder_date?: string | null;
        applicant: string;
        serial_number?: string | null;
        already_order_array?: QuoteOrderRef[] | null;
        from_request_array?: QuoteOrderRef[] | null;
        project_record_id: string;
        quote_end_date: string;
        remark?: string | null;
    };
    supplier_info: {
        supplier_id: string;
        person: string;
        mobile: string;
        email?: string | null;
        orig_order_number: string;
    };
    delivery_info: {
        delivery_company_id?: string | null;
        delivery_postcode?: string | null;
        delivery_address: [string, string, string | null];
    };
    detail_info?: DetailInfo[] | null;
    payment_info: {
        tax?: string | null;
        tax_fee?: boolean | null;
        currency?: string | null;
        exchange_rate?: number | null;
        pay_method?: string | null;
        pay_cycle?: string | null;
        pay_term?: string | null;
        trade_term?: string | null;
    };
    attachment?: Array<{
        file_name: string;
        file_id?: string | null;
    }> | null;
    pq_total: {
        localSubtotal?: number | null;
        localTotal?: number | null;
        shippingFee?: number | null;
        twdSubtotal?: number | null;
        twdTax?: number | null;
        twdTotal?: number | null;
    };
}

/** 與 React `TMaterialQuoteEdit` 別名一致 */
export type TMaterialQuoteEdit = MaterialQuoteEdit;

export type QuotationDocumentInput = MaterialQuoteEdit;
