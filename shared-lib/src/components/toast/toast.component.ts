import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts | async" 
           class="toast" 
           [ngClass]="toast.type"
           (click)="toastService.remove(toast.id)">
        <span>{{ toast.message }}</span>
        <button class="close-btn">&times;</button>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast {
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      min-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: slideIn 0.3s ease-out forwards;
      pointer-events: auto;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
    }

    .success { background-color: #1E88E5; box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3); }
    .error { background-color: #D84343; box-shadow: 0 4px 12px rgba(216, 67, 67, 0.3); }
    .info { background-color: #066B5A; box-shadow: 0 4px 12px rgba(6, 107, 90, 0.3); }
    .warning { background-color: #F39C12; box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3); }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      margin-left: 10px;
      cursor: pointer;
      opacity: 0.8;
    }

    .close-btn:hover { opacity: 1; }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
    constructor(public toastService: ToastService) { }
}
