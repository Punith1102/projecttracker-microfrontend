import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toasts$ = new BehaviorSubject<Toast[]>([]);
    toasts = this.toasts$.asObservable();
    private counter = 0;

    constructor() { }

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
        const id = this.counter++;
        const newToast: Toast = { id, message, type };

        const currentToasts = this.toasts$.value;
        this.toasts$.next([...currentToasts, newToast]);

        setTimeout(() => {
            this.remove(id);
        }, 3000);
    }

    remove(id: number) {
        const currentToasts = this.toasts$.value;
        this.toasts$.next(currentToasts.filter(t => t.id !== id));
    }
}
