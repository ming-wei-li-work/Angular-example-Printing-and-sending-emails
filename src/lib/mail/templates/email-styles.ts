/** Email inline styles — 對齊 React templates-style.tsx，供 ngStyle 綁定。 */
export type EmailStyleMap = Record<string, string | number>;

export const emailStyles = {
    wrapper: {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#333',
        margin: '0',
        padding: '0',
    },
    container: {
        width: '100%',
        maxWidth: '800px',
        borderCollapse: 'collapse',
    },
    sectionHeader: {
        background: '#f5f7fa',
        padding: '8px 10px',
        fontWeight: '700',
        color: '#555',
        fontSize: '14px',
    },
    sectionBody: {
        padding: '10px',
        fontSize: '13px',
        color: '#444',
    },
    title: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#333',
        margin: '0 0 12px 0',
        textAlign: 'center',
    },
    tableCollapse: {
        borderCollapse: 'collapse',
    },
    titleCell: {
        padding: '20px 12px 12px 12px',
        textAlign: 'center',
    },
    metaCell: {
        padding: '0 12px 12px 12px',
        fontSize: '13px',
    },
    metaRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
    },
    sectionGridCell: {
        padding: '8px 12px',
    },
    sectionCol: {
        padding: '4px',
        verticalAlign: 'top',
    },
    mt: {
        marginTop: '6px',
    },
    mailLink: {
        color: '#0b66c3',
        textDecoration: 'none',
    },
    itemTableCell: {
        padding: '8px 12px',
    },
    itemTable: {
        borderCollapse: 'collapse',
        border: '1px solid #eee',
        fontSize: '13px',
        tableLayout: 'fixed',
        width: '100%',
    },
    itemTableHeadRow: {
        background: '#f5f7fa',
        fontWeight: '700',
        textAlign: 'left',
    },
    itemTableTh: {
        borderBottom: '1px solid #ccc',
        padding: '6px',
    },
    itemTableThRight: {
        borderBottom: '1px solid #ccc',
        padding: '6px',
        textAlign: 'right',
    },
    itemTableRow: {
        wordBreak: 'break-word',
        wordWrap: 'break-word',
    },
    itemTableTd: {
        borderBottom: '1px solid #eee',
        padding: '6px',
        textAlign: 'left',
        verticalAlign: 'top',
    },
    itemTableTdRight: {
        borderBottom: '1px solid #eee',
        padding: '6px',
        textAlign: 'right',
        verticalAlign: 'top',
    },
    summaryCell: {
        padding: '8px 12px',
    },
    summaryTable: {
        borderCollapse: 'collapse',
        fontSize: '13px',
        background: '#f5f7fa',
        width: '100%',
    },
    summaryTd: {
        padding: '6px',
    },
    summaryTdRight: {
        padding: '6px',
        textAlign: 'right',
    },
    summaryStrong: {
        fontWeight: '700',
    },
} as const satisfies Record<string, EmailStyleMap>;
