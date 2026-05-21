export const CONTRACT_STYLES: Record<string, string> = {
    page: 'print-page flex flex-col items-center px-10 py-12 text-[#333] font-sans',
    container: 'flex flex-col gap-4 w-full max-w-[800px]',
    title: 'text-3xl font-bold text-[#333] text-center mb-8',
    card: '!border-none !shadow-none',
    dateHeader: 'space-y-2 px-3 py-3',
    header: 'space-y-2 px-3 py-3 bg-slate-50',
    headerLabel: 'font-bold bg-slate-50 text-zinc-500 px-2 py-1 rounded-sm',
    content: 'space-y-1 text-sm text-zinc-700 pl-3',
    twoCols:
        'flex flex-col md:flex-row gap-4 px-0 print:grid print:grid-cols-2 print:gap-6 print:items-start',
    col: 'flex-1 !border-none !shadow-none px-0',
    tableContainer: '!border-none !shadow-none overflow-x-auto',
    tableHeaderRow:
        'grid grid-cols-[auto,2fr,auto,auto,auto,auto,auto] bg-slate-50 py-2 px-3 text-sm font-bold text-zinc-500 min-w-[700px]',
    tableRow:
        'grid grid-cols-[auto,2fr,auto,auto,auto,auto,auto] items-center border-b border-zinc-200 py-2 px-3 text-sm text-zinc-700 min-w-[700px]',
    tableSummary:
        'grid grid-cols-[auto,2fr,auto,auto,auto,auto,auto] items-center bg-neutral-50 py-2 px-3 mt-2 min-w-[700px]',
};

export const tableStylesWide = {
    header: 'grid grid-cols-9 gap-2 bg-slate-50 py-2 px-3 text-sm font-bold text-zinc-500',
    row: 'grid grid-cols-9 gap-2 items-center border-b border-zinc-200 py-2 px-3 text-sm text-zinc-700 bg-white break-words',
    summary: 'grid grid-cols-8 items-center bg-neutral-50 py-2 px-3 mt-2',
};
