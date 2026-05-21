import {
    ApplicationRef,
    ComponentRef,
    createComponent,
    EnvironmentInjector,
    Injectable,
    Type,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComponentRenderService {
    constructor(
        private readonly appRef: ApplicationRef,
        private readonly environmentInjector: EnvironmentInjector
    ) {}

    renderToHost<T extends object>(
        component: Type<T>,
        hostElement: HTMLElement,
        inputs: Record<string, unknown> = {},
        _targetDocument?: Document
    ): ComponentRef<T> {
        const componentRef = createComponent(component, {
            environmentInjector: this.environmentInjector,
            hostElement,
        });

        for (const [key, value] of Object.entries(inputs)) {
            componentRef.setInput(key, value);
        }

        this.appRef.attachView(componentRef.hostView);
        this.appRef.tick();
        return componentRef;
    }

    getInnerHtml<T extends object>(component: Type<T>, inputs: Record<string, unknown> = {}): string {
        const host = document.createElement('div');
        const componentRef = this.renderToHost(component, host, inputs, host.ownerDocument);
        try {
            this.appRef.tick();
            return host.innerHTML;
        } finally {
            this.destroy(componentRef);
        }
    }

    destroy<T>(componentRef: ComponentRef<T>): void {
        try {
            this.appRef.detachView(componentRef.hostView);
        } catch {
            // noop
        }
        try {
            componentRef.destroy();
        } catch {
            // noop
        }
    }
}
