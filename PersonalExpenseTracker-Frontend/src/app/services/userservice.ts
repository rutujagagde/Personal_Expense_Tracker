import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = 'http://localhost:8080/api/users';
    userId: number = 0;

    setUserId(id: number) {
        this.userId = id;
    }

    getUserId(): number {
        return this.userId;
    }
    constructor(private http: HttpClient) { }

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
}
