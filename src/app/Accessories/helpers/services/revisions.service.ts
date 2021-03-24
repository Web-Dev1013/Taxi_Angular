import { Injectable } from '@angular/core';
import { baseUrl } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RevisionsService {

  headers = new Headers();
  token = localStorage.getItem('token');

  constructor(
    private http: HttpClient
  ) { }

  postRevisions(slug, data){
    return this.http.patch(
     `${baseUrl}/contents/${slug}`,
      data,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer' + ' ' + this.token
        ),
      }
    );
  }

  subCategoryPostRevisions(subCategorySlug, postSlug, data){
    return this.http.patch(
      `${baseUrl}/contents/${subCategorySlug}/${postSlug}`,
       data,
       {
         headers: new HttpHeaders().set(
           'Authorization',
           'Bearer' + ' ' + this.token
         ),
       }
     );
  }
  getPostRevision(postSlug){
    return this.http.get(
      `${baseUrl}/contents/revisions/post/${postSlug}`,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer' + ' ' + this.token
        ),
      }
    );
  }

  getSubCategoryPostRevision(SubCategorySlug, postSlug){
    return this.http.get(
      `${baseUrl}/contents/revisions/subcategoryposts/${SubCategorySlug}/${postSlug}`,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer' + ' ' + this.token
        ),
      }
    );
  }
}
