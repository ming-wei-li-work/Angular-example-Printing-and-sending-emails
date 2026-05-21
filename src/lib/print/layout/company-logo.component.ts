import { Component, computed, input } from '@angular/core';
import type { CompanyKey } from '@lib/print/print.types';

@Component({
    selector: 'lib-company-logo',
    standalone: true,
    template: `
        <img
            [src]="logoSrc()"
            alt="Company logo"
            [style.width.px]="width()"
            [style.height.px]="height()"
            [class]="className()"
        />
    `,
})
export class CompanyLogoComponent {
    readonly variant = input<CompanyKey>('alpha');
    readonly width = input(142);
    readonly height = input(37);
    readonly className = input('h-10 object-contain');

    readonly logoSrc = computed(() => {
        const fileName = this.variant() === 'beta' ? 'logo-beta.svg' : 'logo-alpha.svg';
        return `${window.location.origin}${getBaseHref()}${fileName}`;
    });
}

const getBaseHref = (): string => {
    const baseTag = document.querySelector('base');
    const href = baseTag?.getAttribute('href') || '/';
    return href.endsWith('/') ? href : `${href}/`;
};
