import { Injectable } from '@angular/core';
import adminJson from '../jsonFiles/admin_sidebar.json';

import {baseUrl} from '../../../../environments/environment';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {Storage} from '@ionic/storage';
import {StorageService} from './storage.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserSidebarService {

  headers = new Headers();
  token: any;

  constructor( private http: HttpClient , private storagesrv: StorageService) {
    this.token = this.storagesrv.get('token');
  }

  getAllSidebarProducts(){
    return this.http.get(`${baseUrl}/fe/products/`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
    });
  }


}
