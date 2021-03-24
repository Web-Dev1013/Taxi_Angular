import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {StorageService} from './storage.service';
import {baseUrl} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  token: any;
  constructor(private http: HttpClient , private storagesrv: StorageService) {
    this.token = this.token = this.storagesrv.get('token');
   }


  getUsers(){
    return this.http.get(`${baseUrl}/dashboard/`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
    });
  }
}
