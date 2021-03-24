import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public putObject(key, object)
  {
    return localStorage.setItem(key, JSON.stringify(object));
  }

  public getObject(key)
  {
    const values = localStorage.getItem(key);

    return (values) ? null : JSON.parse(values);
  }

  public set(settingName, value) {
    return localStorage.setItem(settingName, value);
  }

  public get(settingName) {
    return localStorage.getItem(settingName);
  }

  public async remove(settingName) {
    return localStorage.removeItem(settingName);
  }

  public clear(){
    return localStorage.clear();
  }

}
