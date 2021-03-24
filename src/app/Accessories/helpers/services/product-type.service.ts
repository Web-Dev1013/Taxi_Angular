import { Injectable } from '@angular/core';
import {baseUrl} from '../../../../environments/environment';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
// import {Storage} from '@ionic/storage';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  headers = new Headers();
  token: any;
  constructor(private http: HttpClient , private storagesrv: StorageService ) {
    this.token = this.storagesrv.get('token');
   }

  getAllProductTypes(){
    return this.http.get(`${baseUrl}/groups/`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
    });
  }

  createProductType(formData){
    return this.http.post(`${baseUrl}/groups/`, formData, {
      headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
    });
  }

  editProductType(productTypeSlug, formData){
    return this.http.put(`${baseUrl}/groups/${productTypeSlug}`, formData, {
      headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
    });
  }

  deleteProductGroups(productGroupId){
    return this.http.delete(`${baseUrl}/groups/${productGroupId}`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
    });
  }
}
