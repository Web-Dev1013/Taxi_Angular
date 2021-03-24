import { Injectable } from '@angular/core';
import adminJson from '../jsonFiles/admin_sidebar.json';
import { baseUrl } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Storage } from '@ionic/storage';
import { StorageService } from './storage.service';
import { shareReplay, catchError, } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cache: any = {};
  public data = [];
  products: any;
  loaded: boolean;
  headers = new Headers();
  token: any;
  constructor(
    private http: HttpClient,
    private storagesrv: StorageService,
    private storage: Storage
  ) {
    this.token = this.storagesrv.get('token');
  }
  public getAllProducts() {
    return this.http.get(`${baseUrl}/products/`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
    });
  }

  public deleteProducts(productId) {
    return this.http.delete(`${baseUrl}/products/${productId}`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
    });
  }

  public addNewProduct(formData) {
    return this.http.post(`${baseUrl}/products/`, formData,
      { headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token) });
  }

  public getProductDetails(productSlug) {
    return this.http.get(`${baseUrl}/products/${productSlug}`,
      { headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token) });
  }

  public editProduct(productSlug, formData) {

    return this.http.put(`${baseUrl}/products/${productSlug}`,
      formData,
      { headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token) });
  }

  getProductsForUsers(productId){
    return this.http
    .get(`${baseUrl}/fe/groups/${productId}/products`, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }
}
