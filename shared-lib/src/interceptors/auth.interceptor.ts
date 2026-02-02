import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const toastService = inject(ToastService);
    const token = authService.getToken();
    let authReq = req;

    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        tap(() => {
            if (token) {
                authService.resetActivityTimer();
            }
        }),
        catchError((error: HttpErrorResponse) => {
            const errorMessage = getErrorMessage(error);

            switch (error.status) {
                case 0:
                    toastService.show('Cannot connect to server. Please check your connection.', 'error');
                    break;
                case 400:
                    toastService.show(errorMessage || 'Bad request. Please check your input.', 'error');
                    break;
                case 401:
                    if (!req.url.includes('/login')) {
                        toastService.show('Session expired. Please login again.', 'warning');
                        authService.logout();
                    }
                    break;
                case 403:
                    toastService.show('Access denied. You do not have permission.', 'error');
                    break;
                case 404:
                    toastService.show(errorMessage || 'Resource not found.', 'error');
                    break;
                case 409:
                    toastService.show(errorMessage || 'Conflict. Resource already exists.', 'error');
                    break;
                case 500:
                case 502:
                case 503:
                    toastService.show('Server error. Please try again later.', 'error');
                    break;
                default:
                    if (error.status >= 400) {
                        toastService.show(errorMessage || 'An unexpected error occurred.', 'error');
                    }
            }

            return throwError(() => error);
        })
    );
};

function getErrorMessage(error: HttpErrorResponse): string {
    if (error.error) {
        if (typeof error.error === 'string') {
            return error.error;
        }
        if (error.error.message) {
            return error.error.message;
        }
        if (error.error.error) {
            return error.error.error;
        }
    }
    return error.message || error.statusText || '';
}
