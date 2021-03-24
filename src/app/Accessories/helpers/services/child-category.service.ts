import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {baseUrl} from '../../../../environments/environment';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChildCategoryService {
token: any ;
  constructor(private storage: Storage, private http: HttpClient , private storagesrv: StorageService) {
    this.token = this.storagesrv.get('token');
  }

createChildCategory(parentCategoryId, formData){
  return this.http.put(`${baseUrl}/categories/${parentCategoryId}`, formData, {
    headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
  });
}
getChildCategoryDetails(parentCategoryId, childCategoryId){
  return this.http.get(`${baseUrl}/categories/${parentCategoryId}/${childCategoryId}`, {
    headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
  });
}
updateChildCategory(parentCategoryId, childCategoryId , formData){
  return this.http.patch(`${baseUrl}/categories/${parentCategoryId}/${childCategoryId}`, formData, {
    headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
  });
}
getChildCategoryContents(parentCategoryId, childCategoryId){
  return this.http.get(`${baseUrl}/categories/${parentCategoryId}/${childCategoryId}/contents`, {
    headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
  });
}
}
