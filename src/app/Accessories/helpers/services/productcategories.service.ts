import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { baseUrl } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root',
})
export class ProductcategoriesService {
  productsCategories: any;
  loaded: boolean;
  token: any;

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private storagesrv: StorageService
  ) {
    this.token = this.storagesrv.get('token');
  }
  createCategory(formData) {
    return this.http.post(`${baseUrl}/categories/`, formData, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }


  sortCategories(categoriesRequest) {
    return this.http.patch(`${baseUrl}/categories/sortOrder`, categoriesRequest, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }

  getCategories() {
    return this.http.get(`${baseUrl}/categories/`, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }

  deleteCategory(categoryId) {
    return this.http.delete(`${baseUrl}/categories/${categoryId}`, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }
  getCategoryDetails(categorySlug) {
    return this.http.get(`${baseUrl}/categories/${categorySlug}`, {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer' + ' ' + this.token
      ),
    });
  }

  editCategory(categorySlug, formData) {
    return this.http
      .patch(
        `${baseUrl}/categories/${categorySlug}`,
        formData,
        {
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer' + ' ' + this.token
          ),
        }
      );
  }
}
