import { Injectable, Type } from '@angular/core';
import { format } from 'date-fns';

import { ComponentRenderService } from '@lib/shared/component-render.service';
import { PrintFooterEnComponent } from '@lib/print/layout/print-footer-en.component';
import { PrintFooterZhComponent } from '@lib/print/layout/print-footer-zh.component';
import { PrintHeaderEnComponent } from '@lib/print/layout/print-header-en.component';
import { PrintHeaderZhComponent } from '@lib/print/layout/print-header-zh.component';
import { QuotationPrintEnComponent } from '@lib/print/templates/quotation-print-en.component';
import { QuotationPrintZhComponent } from '@lib/print/templates/quotation-print-zh.component';
import {
    companyName,
    DEFAULT_COMPANY_INFO_LIST,
    documentType,
    safeGetDynamic,
} from '@lib/print/print.constants';
import type {
    CompanyInfoItem,
    PrintData,
    PrintLang,
    PrintOptions,
    PrintSettings,
    PrintType,
} from '@lib/print/print.types';

type PrintChunk =
    | { kind: 'block'; el: HTMLElement; h: number }
    | {
          kind: 'tableChunk';
          shell: HTMLElement;
          headerEl: HTMLElement;
          rows: HTMLElement[];
          h: number;
      };

const STYLE_TIMEOUT = 2500;
const IMG_LOAD_TIMEOUT = 2000;
const BASE_DELAY_AFTER_RENDER = 140;
const PAGE_PACK_FUDGE_PX = 12;

@Injectable({ providedIn: 'root' })
export class PrintEngineService {
    constructor(private readonly componentRender: ComponentRenderService) {}

    async openPrint({ type, lang, data }: PrintOptions, settings?: PrintSettings): Promise<void> {
        const language = settings?.lang || lang || 'zh';
        const templateComponent = this.getTemplateComponent(type, language);
        if (!templateComponent) {
            alert('無法載入模板');
            return;
        }

        const outputMode = settings?.outputMode ?? 'window';
        const printWindow =
            outputMode === 'window' ? window.open('', '_blank', 'width=900,height=700') : null;

        if (outputMode === 'window' && !printWindow) {
            alert('請允許彈跳視窗以使用列印功能');
            return;
        }

        const targetDocument =
            outputMode === 'window'
                ? printWindow!.document
                : document.implementation.createHTMLDocument('print');
        const sourceDocument = document;

        await copyAndAwaitStyles(sourceDocument, targetDocument, STYLE_TIMEOUT);

        const origin = window.location.origin;
        const baseHref = getBaseHref(sourceDocument);
        const cssBaseUrl = `${origin}${baseHref}`;
        await this.appendPrintStyles(targetDocument, cssBaseUrl);

        const SAFE_MARGIN_MM = 12;
        const FOOTER_GAP_PX = 12;
        const baseStyle = `
            html, body { margin:0; padding:0; height:100%; background:white; }
            #print-pages { display:flex; flex-direction:column; align-items:center; width:100%; box-sizing:border-box; }
            .print-page { width:calc(210mm - ${SAFE_MARGIN_MM * 2}mm); box-sizing:border-box; background:white; margin:0; }
            .page-header { position: static !important; top: auto !important; left: auto !important; width: 100% !important; display: block !important; }
            .page-footer { position: static !important; bottom: auto !important; left: auto !important; width: 100% !important; display: block !important; }
            .page-body { width: 100% !important; display: block !important; box-sizing: border-box; }
            .print-body { padding: 8px 16px; box-sizing: border-box; }
            @media print {
              @page { size: A4; margin: ${SAFE_MARGIN_MM}mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .print-page { padding: 0 !important; box-shadow: none !important; margin: 0 !important; }
            }
        `;
        const baseTag = targetDocument.createElement('style');
        baseTag.textContent = baseStyle;
        targetDocument.head.appendChild(baseTag);

        const companyLangKey = `${settings?.companyInfoVariant ?? 'alpha'}-${language}`;
        const companyNameText = safeGetDynamic(companyName, companyLangKey, companyLangKey);
        const documentTypeText = safeGetDynamic(
            documentType,
            `${type}-${language}`,
            `${type}-${language}`
        );
        const docIdText = data?.delivery?.company ? `#${data.delivery.company}` : '';
        const today = format(new Date(), 'yyyy-MM-dd');
        targetDocument.title =
            `${companyNameText} ${documentTypeText} ${docIdText} ${today} ${language}`.trim();

        const scratch = targetDocument.createElement('div');
        scratch.id = 'print-scratch';
        scratch.style.position = 'absolute';
        scratch.style.top = '0';
        scratch.style.left = '0';
        scratch.style.visibility = 'hidden';
        scratch.style.pointerEvents = 'none';
        targetDocument.body.appendChild(scratch);

        const scratchHeader = targetDocument.createElement('div');
        scratchHeader.className = 'print-header';
        scratch.appendChild(scratchHeader);
        const scratchBody = targetDocument.createElement('div');
        scratchBody.className = 'print-body';
        scratch.appendChild(scratchBody);
        const scratchFooter = targetDocument.createElement('div');
        scratchFooter.className = 'print-footer';
        scratch.appendChild(scratchFooter);

        const HeaderComponent = language === 'en' ? PrintHeaderEnComponent : PrintHeaderZhComponent;
        const FooterComponent = language === 'en' ? PrintFooterEnComponent : PrintFooterZhComponent;

        const key = `${settings?.companyInfoVariant ?? 'alpha'}_${language}` as
            | 'alpha_zh'
            | 'alpha_en'
            | 'beta_zh'
            | 'beta_en';
        const selectedCompanyInfo: CompanyInfoItem =
            settings?.companyInfoMode === 'custom'
                ? settings.headerCompanyInfo || DEFAULT_COMPANY_INFO_LIST[key]
                : (settings?.companyInfoList?.[key] ?? DEFAULT_COMPANY_INFO_LIST[key]);

        const headerRef = this.componentRender.renderToHost(HeaderComponent, scratchHeader, {
            logoVariant: settings?.logoVariant || 'alpha',
            headerLogoUrl: settings?.headerLogoUrl,
            headerCompanyInfo: selectedCompanyInfo,
        });

        const footerRef = this.componentRender.renderToHost(FooterComponent, scratchFooter, {
            contact: data?.supplier ? { name: data.supplier.contactPerson } : {},
            pageNum: 1,
            totalPages: 1,
            showPageNumbers: settings?.showPageNumbers !== false,
        });

        const bodyRef = this.componentRender.renderToHost(templateComponent, scratchBody, {
            data: (data || {}) as PrintData,
        });

        await delay(BASE_DELAY_AFTER_RENDER);
        const images = Array.from(scratchBody.querySelectorAll('img'));
        if (images.length) {
            await Promise.all(
                images.map(
                    image =>
                        new Promise<void>(resolve => {
                            if ((image as HTMLImageElement).complete) {
                                resolve();
                                return;
                            }
                            image.addEventListener('load', () => resolve(), { once: true });
                            image.addEventListener('error', () => resolve(), { once: true });
                            setTimeout(() => resolve(), IMG_LOAD_TIMEOUT);
                        })
                )
            );
        }
        await delay(60);

        const printableWidthPx = Math.round(mmToPx(210 - SAFE_MARGIN_MM * 2));
        scratchBody.style.width = `${printableWidthPx}px`;
        scratchBody.style.maxWidth = `${printableWidthPx}px`;
        scratchBody.style.boxSizing = 'border-box';
        void scratchBody.offsetHeight;

        const headerH = getElementHeight(scratchHeader);
        const footerH = getElementHeight(scratchFooter);
        const PAGE_HEIGHT_PX = Math.round(mmToPx(297));
        const pageMarginTop = Math.round(mmToPx(SAFE_MARGIN_MM));
        const pageMarginBottom = Math.round(mmToPx(SAFE_MARGIN_MM));
        const available =
            PAGE_HEIGHT_PX - pageMarginTop - pageMarginBottom - headerH - footerH - FOOTER_GAP_PX;

        const blocks = getTopLevelBlocksSmart(scratchBody);
        const pagesChunks = packBodyIntoPages(blocks, available, getElementHeight, PAGE_PACK_FUDGE_PX);
        rebalanceHeadingOrphans(pagesChunks, available, 100);
        if (pagesChunks.length === 0) pagesChunks.push([]);

        const pagesContainer = targetDocument.createElement('div');
        pagesContainer.id = 'print-pages';

        const headerSource = scratchHeader.cloneNode(true) as HTMLElement;
        const footerSource = scratchFooter.cloneNode(true) as HTMLElement;
        normalizeClonedHeaderFooter(headerSource);
        normalizeClonedHeaderFooter(footerSource);

        const headerTemplateNode = headerSource.cloneNode(true) as HTMLElement;
        normalizeClonedHeaderFooter(headerTemplateNode);
        const footerTemplateNode = footerSource.firstElementChild
            ? (footerSource.firstElementChild.cloneNode(true) as HTMLElement)
            : null;

        const fragment = targetDocument.createDocumentFragment();
        const provisionalTotal = Math.max(1, pagesChunks.length);

        pagesChunks.forEach((chunkArr, pi) => {
            const isLast = pi === pagesChunks.length - 1;
            const pageEl = targetDocument.createElement('div');
            pageEl.className = 'print-page';
            pageEl.style.pageBreakAfter = isLast ? 'auto' : 'always';
            pageEl.style.breakAfter = isLast ? 'auto' : 'page';

            const clonedHeader = headerTemplateNode.cloneNode(true) as HTMLElement;
            clonedHeader.classList.remove('print-header');
            clonedHeader.classList.add('page-header');
            pageEl.appendChild(clonedHeader);

            const pageBody = targetDocument.createElement('div');
            pageBody.className = 'page-body';
            pageBody.style.minHeight = `${available}px`;

            chunkArr.forEach(ch => {
                if (ch.kind === 'block') {
                    const cloned = ch.el.cloneNode(true) as HTMLElement;
                    removeHeaderLikeNodesFromElement(cloned);
                    stripAbsoluteSubtree(cloned);
                    pageBody.appendChild(cloned);
                } else {
                    pageBody.appendChild(cloneTableChunk(ch, targetDocument));
                }
            });
            pageEl.appendChild(pageBody);

            if (footerTemplateNode) {
                const clonedFooter = footerTemplateNode.cloneNode(true) as HTMLElement;
                const pageNumEl =
                    clonedFooter.querySelector('[data-page-num]') ||
                    clonedFooter.querySelector('.page-num') ||
                    clonedFooter.querySelector('.page-number');
                const totalEl =
                    clonedFooter.querySelector('[data-total-pages]') ||
                    clonedFooter.querySelector('.total-pages');
                if (pageNumEl) (pageNumEl as HTMLElement).textContent = String(pi + 1);
                if (totalEl) (totalEl as HTMLElement).textContent = String(provisionalTotal);
                pageEl.appendChild(clonedFooter);
            }

            fragment.appendChild(pageEl);
        });

        pagesContainer.appendChild(fragment);
        targetDocument.body.appendChild(pagesContainer);

        while (pagesContainer.firstElementChild && pagesContainer.childElementCount > 1) {
            const first = pagesContainer.firstElementChild as HTMLElement;
            const body = first.querySelector('.page-body');
            const text = body ? (body.textContent || '').trim() : '';
            if (!text) first.remove();
            else break;
        }

        applyFooterPageNumbers(pagesContainer);
        await this.awaitNextPaint(targetDocument);
        applyFooterPageNumbers(pagesContainer);

        this.componentRender.destroy(headerRef);
        this.componentRender.destroy(footerRef);
        this.componentRender.destroy(bodyRef);
        scratch.remove();

        const autoPrint = settings?.autoPrint === true;
        switch (outputMode) {
            case 'window':
                if (autoPrint) {
                    setTimeout(() => {
                        printWindow!.focus();
                        printWindow!.print();
                    }, 260);
                } else {
                    injectPrintPreviewToolbar(targetDocument, printWindow!);
                    printWindow!.focus();
                }
                return;
            case 'html':
                settings?.onGenerated?.({ html: '<!DOCTYPE html>\n' + targetDocument.documentElement.outerHTML });
                return;
            case 'document':
                settings?.onGenerated?.({ document: targetDocument });
                return;
            case 'blob':
                settings?.onGenerated?.({
                    blob: new Blob(['<!DOCTYPE html>\n' + targetDocument.documentElement.outerHTML], {
                        type: 'text/html;charset=utf-8',
                    }),
                });
                return;
        }
    }

    private getTemplateComponent(type: PrintType, lang: PrintLang): Type<object> | null {
        switch (`${type}-${lang}`) {
            case 'quotation-zh':
                return QuotationPrintZhComponent;
            case 'quotation-en':
                return QuotationPrintEnComponent;
            default:
                return null;
        }
    }

    private async appendPrintStyles(targetDocument: Document, cssBaseUrl: string): Promise<void> {
        try {
            await appendStylesheetLink(targetDocument, `${cssBaseUrl}print.css`);
            await appendStylesheetLink(targetDocument, `${cssBaseUrl}theme.css`);
            await delay(80);
        } catch (error) {
            console.warn('append print.css/theme.css failed', error);
        }
    }

    private async awaitNextPaint(targetDocument: Document): Promise<void> {
        const raf = targetDocument.defaultView?.requestAnimationFrame?.bind(targetDocument.defaultView);
        if (!raf) {
            await delay(32);
            return;
        }
        await new Promise<void>(resolve => raf(() => raf(() => resolve())));
    }
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const mmToPx = (mm: number): number => (mm / 25.4) * 96;

const appendStylesheetLink = (targetDocument: Document, href: string): Promise<void> =>
    new Promise(resolve => {
        const link = targetDocument.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => resolve();
        targetDocument.head.appendChild(link);
    });

const getBaseHref = (doc: Document): string => {
    const baseTag = doc.querySelector('base');
    const href = baseTag?.getAttribute('href') || '/';
    return href.endsWith('/') ? href : `${href}/`;
};

const copyAndAwaitStyles = async (
    srcDoc: Document,
    targetDoc: Document,
    timeoutPer = STYLE_TIMEOUT
): Promise<void> => {
    const linkPromises: Promise<void>[] = [];
    Array.from(srcDoc.head.children).forEach(node => {
        try {
            const tag = node.tagName;
            if (tag === 'LINK' && (node as HTMLLinkElement).rel === 'stylesheet') {
                const orig = node as HTMLLinkElement;
                const clone = targetDoc.createElement('link');
                clone.rel = 'stylesheet';
                clone.href = orig.href;
                if (orig.media) clone.media = orig.media;
                if (orig.crossOrigin) clone.crossOrigin = orig.crossOrigin;
                if (orig.integrity) clone.setAttribute('integrity', orig.integrity);
                targetDoc.head.appendChild(clone);
                linkPromises.push(
                    new Promise<void>(resolve => {
                        let done = false;
                        const fin = () => {
                            if (!done) {
                                done = true;
                                resolve();
                            }
                        };
                        clone.addEventListener('load', fin);
                        clone.addEventListener('error', fin);
                        setTimeout(fin, timeoutPer);
                    })
                );
            } else if (tag === 'STYLE') {
                const cloneStyle = targetDoc.createElement('style');
                cloneStyle.textContent = (node as HTMLStyleElement).textContent;
                targetDoc.head.appendChild(cloneStyle);
            } else if (tag === 'LINK' && (node as HTMLLinkElement).rel === 'preload') {
                const orig = node as HTMLLinkElement;
                const clone = targetDoc.createElement('link');
                Array.from(orig.attributes).forEach(attr => clone.setAttribute(attr.name, attr.value));
                targetDoc.head.appendChild(clone);
            }
        } catch (error) {
            console.warn('copy style node failed', error);
        }
    });
    await Promise.all(linkPromises);
};

const normalizeClonedHeaderFooter = (el: HTMLElement): void => {
    ['print-header', 'print-footer', 'fixed-header', 'fixed', 'sticky'].forEach(cls =>
        el.classList.remove(cls)
    );
    el.style.position = 'static';
    el.style.top = '';
    el.style.bottom = '';
    el.style.left = '';
    el.style.right = '';
    Array.from(el.querySelectorAll<HTMLElement>('*')).forEach(d => {
        if (['fixed', 'sticky', 'absolute'].includes(d.style.position)) {
            d.style.position = 'static';
            d.style.top = '';
            d.style.bottom = '';
            d.style.left = '';
            d.style.right = '';
        }
        d.classList.remove('print-only');
    });
};

const isHeadingElement = (el: HTMLElement): boolean => {
    const tag = el.tagName.toUpperCase();
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tag)) return true;
    if (el.getAttribute('role') === 'heading') return true;
    const cls = (el.className || '').toLowerCase();
    return (
        cls.includes('title') ||
        cls.includes('heading') ||
        cls.includes('main-title') ||
        cls.includes('doc-title')
    );
};

const isHeaderLikeNode = (el: HTMLElement): boolean => {
    const selectors = [
        '.print-header',
        '.page-header',
        'header',
        '[role="banner"]',
        '.document-header',
        '.site-header',
        '.doc-header',
    ];
    try {
        return selectors.some(s => !!el.matches?.(s));
    } catch {
        return false;
    }
};

const getTopLevelBlocksSmart = (bodyEl: HTMLElement): HTMLElement[] => {
    const explicit = Array.from(bodyEl.querySelectorAll<HTMLElement>('[data-print-block], .print-block'));
    if (explicit.length > 0) return explicit.filter(el => !isHeaderLikeNode(el));
    const direct = Array.from(bodyEl.children) as HTMLElement[];
    let candidates = direct;
    if (direct.length === 1) {
        const subs = Array.from(direct[0].children) as HTMLElement[];
        if (subs.length > 0) candidates = subs;
    }
    const filtered = candidates.filter(c => !isHeaderLikeNode(c));
    if (filtered.length > 0) return filtered;
    const fallback = Array.from(
        bodyEl.querySelectorAll<HTMLElement>('section, article, p, table, ul, ol, div')
    );
    return fallback.length > 0 ? fallback.filter(el => !isHeaderLikeNode(el)) : [bodyEl];
};

const removeHeaderLikeNodesFromElement = (el: HTMLElement): void => {
    try {
        [
            'header',
            '[role="banner"]',
            '.print-header',
            '.site-header',
            '.document-header',
            '.doc-header',
            '.page-header',
        ].forEach(sel => {
            Array.from(el.querySelectorAll(sel)).forEach(n => n.remove());
        });
    } catch {
        // noop
    }
};

const getElementHeight = (el: HTMLElement): number => {
    try {
        const h = el.offsetHeight;
        if (h && h > 0) return Math.ceil(h);
    } catch {
        // noop
    }
    try {
        return Math.ceil(el.getBoundingClientRect().height);
    } catch {
        return 0;
    }
};

const tryParseSplittableTable = (
    block: HTMLElement
): { shell: HTMLElement; headerEl: HTMLElement; rows: HTMLElement[] } | null => {
    const headerEl = block.querySelector<HTMLElement>('[data-print-table-header]');
    const rows = Array.from(block.querySelectorAll<HTMLElement>('[data-print-table-row]'));
    if (!headerEl || rows.length === 0) return null;
    return { shell: block, headerEl, rows };
};

const sumChunksH = (chunks: PrintChunk[]): number => chunks.reduce((s, c) => s + c.h, 0);

const stripAbsoluteSubtree = (root: HTMLElement): void => {
    const allNodes = root.getElementsByTagName('*');
    for (let i = 0; i < allNodes.length; i++) {
        const d = allNodes[i] as HTMLElement;
        if (['fixed', 'sticky', 'absolute'].includes(d.style.position)) {
            d.style.position = 'static';
            d.style.top = '';
            d.style.bottom = '';
            d.style.left = '';
            d.style.right = '';
        }
    }
};

const cloneTableChunk = (
    ch: Extract<PrintChunk, { kind: 'tableChunk' }>,
    doc: Document
): HTMLElement => {
    const wrap = doc.createElement('div');
    wrap.className = ch.shell.className;
    wrap.removeAttribute('id');
    const hc = ch.headerEl.cloneNode(true) as HTMLElement;
    removeHeaderLikeNodesFromElement(hc);
    stripAbsoluteSubtree(hc);
    wrap.appendChild(hc);
    for (const row of ch.rows) {
        const rc = row.cloneNode(true) as HTMLElement;
        removeHeaderLikeNodesFromElement(rc);
        stripAbsoluteSubtree(rc);
        wrap.appendChild(rc);
    }
    return wrap;
};

const packBodyIntoPages = (
    blocks: HTMLElement[],
    available: number,
    getH: (el: HTMLElement) => number,
    packFudgePx = 0
): PrintChunk[][] => {
    const cap = available + packFudgePx;
    const pages: PrintChunk[][] = [];
    let curr: PrintChunk[] = [];
    let currAcc = 0;

    const flushPage = (): void => {
        if (curr.length) pages.push(curr);
        curr = [];
        currAcc = 0;
    };

    const pushChunk = (chunk: PrintChunk): void => {
        if (curr.length > 0 && currAcc + chunk.h > cap) flushPage();
        curr.push(chunk);
        currAcc += chunk.h;
    };

    for (const block of blocks) {
        const table = tryParseSplittableTable(block);
        if (!table) {
            pushChunk({ kind: 'block', el: block, h: getH(block) });
            continue;
        }

        const { shell, headerEl, rows } = table;
        const headerH = getElementHeight(headerEl);
        let rowPairs = rows.map(el => ({ el, h: getH(el) }));

        while (rowPairs.length > 0) {
            if (curr.length > 0 && currAcc + headerH + rowPairs[0].h > cap) {
                flushPage();
            }

            const space = cap - currAcc;
            let rowTake = 0;
            let chunkH = headerH;
            while (rowTake < rowPairs.length && chunkH + rowPairs[rowTake].h <= space) {
                chunkH += rowPairs[rowTake].h;
                rowTake++;
            }
            if (rowTake === 0) {
                chunkH += rowPairs[0].h;
                rowTake = 1;
            }

            const takenRows = rowPairs.slice(0, rowTake).map(p => p.el);
            rowPairs = rowPairs.slice(rowTake);
            const chunk: PrintChunk = {
                kind: 'tableChunk',
                shell,
                headerEl,
                rows: takenRows,
                h: chunkH,
            };

            if (curr.length > 0 && currAcc + chunk.h > cap) flushPage();
            curr.push(chunk);
            currAcc += chunk.h;
        }
    }

    if (curr.length) pages.push(curr);
    return pages;
};

const rebalanceHeadingOrphans = (
    pages: PrintChunk[][],
    available: number,
    minBuffer: number
): void => {
    for (let pi = 0; pi < pages.length - 1; pi++) {
        const page = pages[pi];
        if (!page?.length) continue;
        const last = page[page.length - 1];
        if (!last || last.kind !== 'block' || !isHeadingElement(last.el)) continue;

        const nextPageIndex = pi + 1;
        const nextPageHeight = sumChunksH(pages[nextPageIndex] || []);
        const nextAvailable = available - nextPageHeight;
        if (last.h <= nextAvailable - minBuffer) {
            page.pop();
            pages[nextPageIndex].unshift(last);
            pi = Math.max(-1, pi - 1);
        }
    }
};

const applyFooterPageNumbers = (root: HTMLElement): void => {
    const pages = Array.from(root.querySelectorAll<HTMLElement>('.print-page'));
    const total = pages.length;
    pages.forEach((page, i) => {
        const footer =
            (page.querySelector('footer') as HTMLElement | null) ||
            (page.querySelector('.page-footer') as HTMLElement | null);
        if (!footer) return;
        const pn = footer.querySelector('[data-page-num]');
        const tp = footer.querySelector('[data-total-pages]');
        if (pn) pn.textContent = String(i + 1);
        if (tp) tp.textContent = String(total);
    });
};

const injectPrintPreviewToolbar = (doc: Document, win: Window): void => {
    const style = doc.createElement('style');
    style.textContent = `
        @media print { #print-preview-toolbar { display: none !important; } body { padding-top: 0 !important; } }
        @media screen { body { padding-top: 48px; } }
    `;
    doc.head.appendChild(style);

    const toolbar = doc.createElement('div');
    toolbar.id = 'print-preview-toolbar';
    toolbar.style.cssText =
        'position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;gap:8px;padding:8px 12px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;';

    const createBtn = (label: string, onClick: () => void): HTMLButtonElement => {
        const btn = doc.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.style.cssText =
            'padding:6px 14px;border-radius:6px;border:1px solid #cbd5e1;background:white;cursor:pointer;font-size:14px;';
        btn.addEventListener('click', onClick);
        return btn;
    };

    toolbar.appendChild(createBtn('列印', () => win.print()));
    toolbar.appendChild(createBtn('關閉', () => win.close()));
    doc.body.insertBefore(toolbar, doc.body.firstChild);
};
