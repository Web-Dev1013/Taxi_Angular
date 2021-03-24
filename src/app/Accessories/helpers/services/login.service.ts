import { Injectable } from '@angular/core';
import { baseUrl } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { StorageService } from './storage.service';
import { ToastService } from '../services/toast.service';


@Injectable({
  providedIn: 'root'
})
  export class LoginService {
  token: string = localStorage.getItem('token');
  authState = new BehaviorSubject(false);
  userImage = localStorage.getItem('image');
  firstName: string;
  lastName: string;
  email: string;
  constructor(
    private http: HttpClient,
    private route: Router,
    private storage: Storage,
    private storageserv: StorageService,
    private platform: Platform,
    private toastServ: ToastService) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  ifLoggedIn() {
    this.storage.get('user_details').then((response) => {
      if (response) {
        this.authState.next(true);
      }
    });
  }
  login(params): Observable<any> {
    return this.http.post(`${baseUrl}/auth/login`, params);
  }

  register(params) {
    return this.http.post(`${baseUrl}/auth/register`, params);
  }
  async logout() {
    await this.storage.clear().then((resolve) => {
      this.storageserv.clear();
      // $ionicHistory.clearCache().then(function(){ $state.go('app.fooState') })
      this.route.navigate(['login']);
      this.authState.next(false);
    });
    window.location.reload();

  }

  isAuthenticated() {
    return this.authState.value;
  }
  createAuthorizationHeader(headers: HttpHeaders) {
    headers.append('Content-Type', 'application/json');
  }
  ChangePassword(passwords) {
    return this.http.post(`${baseUrl}/profile/change-password`, passwords, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer' + ' ' + this.storageserv.get('token'))
    });
  }
}
