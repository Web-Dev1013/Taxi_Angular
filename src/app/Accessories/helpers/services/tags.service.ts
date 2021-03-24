import { Injectable } from '@angular/core';
import {baseUrl} from '../../../../environments/environment';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable, } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {Storage} from '@ionic/storage';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  token: any;
  constructor(private storage: Storage, private http: HttpClient , private storagesrv: StorageService) {
    this.token = this.storagesrv.get('token');
   }
  displayTags(){
    return this.http.get(`${baseUrl}/dashboard/tags`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
    });
  }
}
