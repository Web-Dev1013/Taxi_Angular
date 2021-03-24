import { Injectable } from '@angular/core';
import { baseUrl } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  headers = new Headers();

  constructor(private http: HttpClient) { }

  token = localStorage.getItem('token');
  userId = localStorage.getItem('userId');

  getUsers(page, firstName = null, email = null) {
    const qp = new URLSearchParams();
    qp.set('page', page);
    if (firstName) {
      qp.set('firstName', firstName);
    }
    if (email) {
      qp.set('email', email);
    }
    return this.http.get(`${baseUrl}/users?` + qp.toString(), {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }

  getUserDetail() {
    // console.log("token inside detail", this.token);
    return this.http.get(`${baseUrl}/users/this.userId`, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }

  resetUsers(usersId) {
    // console.log("token inside reset user", this.token);
    return this.http.put(
      `${baseUrl}/users/${usersId}/resetPassword`,
      {},
      {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer' + ' ' + this.token
        ),
      }
    );
  }

  getSelectedUserDetails(rowId) {
    return this.http
      .get(`${baseUrl}/users/${rowId}`, {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer' + ' ' + this.token
        ),
      });
  }

  deleteUser(userId) {
    return this.http
      .delete(`${baseUrl}/users/${userId}`, {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer' + ' ' + this.token
        ),
      });
  }

  updateUser(userId, data) {
    return this.http
      .put(
        `${baseUrl}/users/${userId}`,
        data,
        {
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer' + ' ' + this.token
          ),
        }
      );
  }

}
