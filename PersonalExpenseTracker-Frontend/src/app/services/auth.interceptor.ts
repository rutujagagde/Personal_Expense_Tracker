
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('accessToken');

    // Check whether the request is going to our backend.
    const isBackendRequest =
        req.url.startsWith('https://personal-expense-tracker-backend-oek7.onrender.com/api/') ||
        req.url.startsWith('http://localhost:8080/api/');

    // Do not attach JWT token to public APIs.
    const isPublicRequest =
        req.url.includes('/api/login') ||
        req.url.includes('/api/register') ||
        req.url.includes('/api/refresh');

    if (token && isBackendRequest && !isPublicRequest) {

        const authRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(authRequest);
    }

    return next(req);
};
