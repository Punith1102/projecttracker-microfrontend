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
    private toastChannel: BroadcastChannel;

    constructor() {
        // Use BroadcastChannel for cross-MFE communication
        this.toastChannel = new BroadcastChannel('toast-channel');

        // Listen for toast messages from other MFEs
        this.toastChannel.onmessage = (event) => {
            if (event.data.action === 'ADD_TOAST') {
                this.addToastLocally(event.data.toast);
            } else if (event.data.action === 'REMOVE_TOAST') {
                this.removeLocally(event.data.id);
            }
        };
    }

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
        const id = Date.now() + Math.random(); // Unique ID across all instances
        const newToast: Toast = { id, message, type };

        // Add locally first
        this.addToastLocally(newToast);

        // Broadcast to other MFEs
        this.toastChannel.postMessage({ action: 'ADD_TOAST', toast: newToast });

        // Auto-remove after 3 seconds
        setTimeout(() => {
            this.remove(id);
        }, 3000);
    }

    private addToastLocally(toast: Toast) {
        const currentToasts = this.toasts$.value;
        // Avoid duplicates (by id)
        if (!currentToasts.find(t => t.id === toast.id)) {
            this.toasts$.next([...currentToasts, toast]);
        }
    }

    remove(id: number) {
        this.removeLocally(id);
        // Broadcast removal to other MFEs
        this.toastChannel.postMessage({ action: 'REMOVE_TOAST', id });
    }

    private removeLocally(id: number) {
        const currentToasts = this.toasts$.value;
        this.toasts$.next(currentToasts.filter(t => t.id !== id));
    }
}


