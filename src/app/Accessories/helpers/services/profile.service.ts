import { Injectable } from '@angular/core';
import { baseUrl } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  headers = new Headers();
  token = localStorage.getItem('token');
  constructor(
    private http: HttpClient
    ) { }

  updateProfile(userData){
    return this.http.post(`${baseUrl}/profile/update-profile`, userData,  {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }
}
