import { Injectable } from '@angular/core';
import { baseUrl } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryImageServiceService {

  constructor(
    private http: HttpClient
  ) { }


  getListFiles(): Observable<any> {
    const req = new HttpRequest("GET", `${baseUrl}/files`, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  upload(file: any, id: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('id', id);
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    const req = new HttpRequest('POST', `${baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  saveImageInfo(id: any, fileName: any, altData: any, caption: any, stateFlag: any): Observable<HttpEvent<any>> {
    const imageInfo = { id, fileName, altData, caption, stateFlag };
    const req = new HttpRequest("POST", `${baseUrl}/saveImageInfo`, imageInfo, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  removeImage(removeImageId: any): Observable<HttpEvent<any>> {
    const id = {removeImageId};
    const req = new HttpRequest("POST", `${baseUrl}/removeImage`, id, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
