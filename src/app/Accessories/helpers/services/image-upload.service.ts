import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import {baseUrl} from '../../../../environments/environment';
import {StorageService} from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  xhr = new XMLHttpRequest();
  token: string;

  constructor(
    private http: HttpClient,
    private storagesrv : StorageService
    ) { 
    this.token=this.storagesrv.get('token');
  }

  getUrl(data){      
    this.xhr.withCredentials = false;
    return this.http.post(`${baseUrl}/contents/image-uploader`, data,{
      headers: new HttpHeaders().set('Authorization','Bearer' + ' ' +this.token)
    });
  }

serverSideImageUpload(
    blobInfo,
    success,
    failure,
    progress
) {
    var xhr, formData;
    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open("POST", 'http://localhost:5000/contents/image-uploader');

    xhr.upload.onprogress = function (e) {
        progress((e.loaded / e.total) * 100);
    };

    xhr.onload = function () {
        var json;

        if (xhr.status === 403) {
            failure("HTTP Error: " + xhr.status, {
                remove: true
            });
            return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
            failure("HTTP Error: " + xhr.status);
            return;
        }

        json = JSON.parse(xhr.responseText);

        if (!json || typeof json.data != "string") {
            failure("Invalid JSON: " + xhr.responseText);
            return;
        }

        success(`http://localhost:5000/${json.data}`);
    };

    xhr.onerror = function () {
        failure(
            "Image upload failed due to a XHR Transport error. Code: " +
            xhr.status
        );
    };

    formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
}


success(success,failure,blobInfo){

    var json;

    if (this.xhr.status === 403) {
        failure("HTTP Error: " + this.xhr.status, {
            remove: true
        });
        return;
    }

    if (this.xhr.status < 200 || this.xhr.status >= 300) {
        failure("HTTP Error: " + this.xhr.status);
        return;
    }

    json = JSON.parse(this.xhr.responseText);

    if (!json || typeof json.data != "string") {
        failure("Invalid JSON: " + this.xhr.responseText);
        return;
    }

    success(`http://localhost:5000/${json.data}`);
    let formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());
    this.xhr.send(formData);
  
}


}
