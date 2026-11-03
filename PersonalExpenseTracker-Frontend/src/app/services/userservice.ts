import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = 'http://localhost:8080/api/users';
    userId: number = Number(sessionStorage.getItem('spendwiseUserId') || 0);

    setUserId(id: number) {
        this.userId = id;
        sessionStorage.setItem('spendwiseUserId', String(id));
    }

    getUserId(): number {
        return this.userId || Number(sessionStorage.getItem('spendwiseUserId') || 0);
    }
    constructor(private http: HttpClient) { }

    logout() { this.userId = 0; sessionStorage.removeItem('spendwiseUserId'); }

    getAllUsers() {
        return this.http.get(this.apiUrl);
    }

    getUserById(id: number) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    getMessage() {
        return 'Welcome to SpendWise!';
    }
    login(user: any) {
        return this.http.post<any>(
            'http://localhost:8080/api/login',
            user
        );
    }
    register(user: any): Observable<any> {

        return this.http.post<any>(
            'http://localhost:8080/api/register',
            user
        );

    }
    // Update user profile
    updateUser(id: number, user: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, user);
    }
}
