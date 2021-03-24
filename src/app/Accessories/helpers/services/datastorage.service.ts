import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DatastorageService {

  public data: any;
  public role: any = localStorage.getItem('role');

  public product: any;

  constructor() { }

  private userRole = new BehaviorSubject<any>(this.role);
  getRole = this.userRole.asObservable();

}
