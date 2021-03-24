import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import sidebarJson from '../jsonFiles/child.json';

@Injectable({
  providedIn: 'root'
})
export class SidebarDataService {

  public data: any;

  sidebarData = sidebarJson;
  constructor() { }


  private sideBarSource = new BehaviorSubject<any>(this.sidebarData.sidebar[0]);
  sideBar = this.sideBarSource.asObservable();


  private sideBarAll = new BehaviorSubject<any>(this.sidebarData.sidebar);
  allsidebarChildren = this.sideBarAll.asObservable();

  // changeUsername(sidebar: any) {
  //   this.sideBarSource.next(sidebar);
  // }

  // getAllComponents(sidebar:any){
  //   this.sideBarSource.next(sidebar);
  // }

}
