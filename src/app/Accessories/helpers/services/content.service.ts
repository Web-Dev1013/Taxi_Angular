import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {StorageService} from './storage.service';
import {baseUrl} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ContentService {
  token: any;
  content: any ;
  loaded: boolean ;

  constructor(private storage: Storage, private http: HttpClient , private storagesrv: StorageService) {
    this.token = this.storagesrv.get('token');
   }

createContent(formData){
  return this.http.post(`${baseUrl}/contents/`, formData, {
    headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
  });
}

deleteSubCategory(type, ContentId){
  return this.http.delete(`${baseUrl}/contents/type/${type}/${ContentId}`, {
    headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token)
  });
}
getContents(categorySlug){
  return this.http
  .get(`${baseUrl}/categories/${categorySlug}/contents`, {
    headers: new HttpHeaders().set(
      'Authorization',
      'Bearer' + ' ' + this.token
    ),
  });
}

deleteContents(contentSlug){
  return this.http
  .delete(`${baseUrl}/contents/${contentSlug}`, {
    headers: new HttpHeaders().set(
      'Authorization',
      'Bearer' + ' ' + this.token
    ),
  });
}

getSubCategoryPosts(subCategorySlug){
  return this.http
        .get(`${baseUrl}/contents/${subCategorySlug}`, {
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer' + ' ' + this.token
          ),
        });
}

deleteSubcategoryPost(subCategorySlug, postSlug){
  return this.http
  .delete(`${baseUrl}/contents/${subCategorySlug}/${postSlug}`, {
    headers: new HttpHeaders().set(
      'Authorization',
      'Bearer' + ' ' + this.token
    ),
  });
}

editSubCategory(contentSlug, formData){
  return this.http
  .patch(
    `${baseUrl}/contents/${contentSlug}`,
    formData,
    {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    }
  );
}

createSubcategoryPost(subCategoryId, formData){
  return this.http.put(`${baseUrl}/contents/${subCategoryId}`, formData,
  { headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + this.token) });
}

editSubactegoryPost(subCategoryId, postId, formData){
  return this.http.patch(
    `${baseUrl}/contents/${subCategoryId}/${postId}`,
    formData,
    {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    }
  );
}
getContentDetails(postId){
  return this.http
  .get(`${baseUrl}/contents/${postId}`, {
    headers: new HttpHeaders().set(
      'Authorization',
      'Bearer' + ' ' + this.token
    ),
  });
}
updateSimplePost(postId, formData){
  return this.http
  .patch(
    `${baseUrl}/contents/${postId}`,
    formData,
    {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    }
  );
}
getSubCategoryPostDetail(subCategoryId, postId){
  return this.http
  .get(`${baseUrl}/contents/${subCategoryId}/${postId}`, {
    headers: new HttpHeaders().set(
      'Authorization',
      'Bearer' + ' ' + this.token
    ),
  });
}



}
