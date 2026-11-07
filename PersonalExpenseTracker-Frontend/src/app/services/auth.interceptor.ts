import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('accessToken');

    // Do not attach a token to third-party requests.
    const isBackendRequest = req.url.startsWith(
        'http://localhost:8080/api/'
    ) || req.url.includes('/api/');

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