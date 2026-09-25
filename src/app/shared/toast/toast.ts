import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

// App-wide popup notifications, rendered by <app-toast-container> in the root.
@Injectable({ providedIn: 'root' })
export class ToastService {

  readonly toasts = signal<Toast[]>([]);

  private nextId = 1;

  success(message: string): void {
    this.show('success', message, 3000);
  }

  error(message: string): void {
    this.show('error', message, 5000);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private show(type: ToastType, message: string, duration: number): void {
    const id = this.nextId++;
    this.toasts.update(list => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), duration);
  }

}
