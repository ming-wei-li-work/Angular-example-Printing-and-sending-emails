/** 列印模組型別：PrintData 為模板消費的結構，PrintSettings 控制語系/Logo/是否自動列印 */
export type CompanyKey = 'alpha' | 'beta';
export type PrintLang = 'zh' | 'en';

export interface PrintHeader {
    title: string;
    serialNumber?: string | null;
    project?: string | null;
    date?: string | null;
    expiryDate?: string | null;
    userName?: string | null;
    remark?: string | null;
    email?: string | null;
    phone?: string | null;
}

export interface PrintSupplier {
    name?: string;
    serialNumber?: string;
    contactPerson?: string;
    contactMobile?: string;
    contactEmail?: string;
    contactNumber?: string;
    contactFaxNumber?: string;
    orderNumber?: string;
}

export interface PrintPayment {
    vatType?: string;
    currency?: string;
    method?: string;
    cycle?: string;
    term?: string;
    tradeTerm?: string;
    exchange_rate?: number;
    tax_fee?: boolean;
}

export interface PrintItem {
    id?: string | null;
    name?: string | null;
    spec?: string | null;
    brand?: string | null;
    qty?: number | null;
    unit?: string | null;
    amount?: number | null;
    totalAmount?: number | null;
    remark?: string | null;
}

export interface PrintSummary {
    localSubtotal?: string | number;
    localTotal?: string | number;
    shippingFee?: string | number;
    twdSubtotal?: string | number;
    twdTax?: string | number;
    twdTotal?: string | number;
}

export interface PrintDelivery {
    company?: string;
    postcode?: string;
    address?: string[];
}

/** 列印模板主資料結構（詢價單 PQ） */
export interface PrintData {
    sourceType: 'PQ';
    header: PrintHeader;
    supplier?: PrintSupplier;
    payment?: PrintPayment;
    items?: PrintItem[];
    attachments?: unknown[];
    delivery?: PrintDelivery;
    summary?: PrintSummary;
}

export interface PrintSettings {
    lang?: PrintLang;
    logoVariant?: CompanyKey;
    companyInfoVariant?: CompanyKey;
    headerLogoUrl?: string;
    companyInfoMode?: 'default' | 'custom';
    headerCompanyInfo?: CompanyInfoItem;
    companyInfoList?: CompanyInfoList;
    showPageNumbers?: boolean;
    showSignature?: boolean;
    /** 渲染完成後是否自動呼叫 window.print()；Demo 預設 false，改由預覽工具列手動列印 */
    autoPrint?: boolean;
    outputMode?: PrintOutputMode;
    onGenerated?: (result: PrintGeneratedResult) => void;
}

export type PrintType = 'quotation';
export type PrintOutputMode = 'window' | 'html' | 'document' | 'blob';

export interface CompanyInfoItem {
    zhName: string;
    enName: string;
    address: string;
    taxId?: string;
    tel?: string;
    fax?: string;
}

export type CompanyInfoList = Record<'alpha_zh' | 'alpha_en' | 'beta_zh' | 'beta_en', CompanyInfoItem>;

export interface PrintOptions {
    type: PrintType;
    lang: PrintLang;
    data?: PrintData;
}

export interface PrintGeneratedResult {
    html?: string;
    document?: Document;
    blob?: Blob;
}

export interface FooterProps {
    contact?: {
        id?: string;
        name?: string;
    };
    pageNum?: number;
    totalPages?: number;
    showPageNumbers?: boolean;
}
