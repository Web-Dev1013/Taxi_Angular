import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { baseUrl } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root',
})
export class PostCommentService {
  // products_categories : any ;
  loaded: boolean;
  token: any;

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private storagesrv: StorageService
  ) {
    this.token = this.storagesrv.get('token');
  }

  postNewComment(formData) {
    return this.http.post(`${baseUrl}/comment/`, formData, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }

  updateComment(commentId, formData) {
    return this.http.patch(`${baseUrl}/comment/${commentId}`, formData, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }



  getComments(page, contentSlug, subContentSlug) {
    // //console.log("subContentSlug",subContentSlug,'contentSlug',contentSlug);;
   // //console.log('page', page);
    const qp = new URLSearchParams();
    qp.set('page', page);

    const url = (subContentSlug) ?
      `${baseUrl}/comment/subcategory/${contentSlug}/${subContentSlug}?` + qp.toString() :
      `${baseUrl}/comment/post/${contentSlug}?` + qp.toString();


    return this.http.get(url, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }

  deleteComment(postCommentId) {
    return this.http.delete(`${baseUrl}/comment/${postCommentId}`, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }

  markInAppropriate(commentId) {
    return this.http.patch(`${baseUrl}/comment/${commentId}/flag`, {}, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }
}
