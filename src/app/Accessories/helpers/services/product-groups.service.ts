import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { baseUrl } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProductGroupsService {
  headers = new Headers();
  token: any;


  constructor(private http: HttpClient, private storageSrv: StorageService) {
    this.token = this.storageSrv.get('token');
  }

  getProductGroupsForUser() {
    return this.http.get(`${baseUrl}/fe/groupProducts/`, {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.token}`
      ),
    });
  }

  getProductCategories(productId) {
    return this.http.get(
      `${baseUrl}/fe/products/${productId}/categories`,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.token}`
        ),
      }
    );
  }

  getCategoryContents(categoryId) {
    return this.http.get(`${baseUrl}/fe/categories/${categoryId}/contents`, {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.token}`
      ),
    });
  }

  getSubCategoryPosts(categoryId, subcategoryId) {
    return this.http.get(
      `${baseUrl}/fe/contents/${categoryId}/posts/${subcategoryId}`,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.token}`
        ),
      }
    );
  }

  getCategoriesAndContents(productId) {
    return this.http.get(`${baseUrl}/fe/products/${productId}`, {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.token}`
      ),
    });
  }
}
