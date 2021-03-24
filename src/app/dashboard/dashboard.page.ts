import { Component, OnInit } from '@angular/core';
import {SidebarDataService} from '../Accessories/helpers/services/sidebar-data.service';
import {DashboardService} from '../Accessories/helpers/services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  role = localStorage.getItem('role');
  sideBarInfo: any;
  allSidebarChildren: any;
  dashboard: any;
  usersCount: any;
  title: any;
  constructor(private sideserv: SidebarDataService , private dashboardServ: DashboardService) {


  }


  ngOnInit() {

    // //console.log('role in dashboard constructor is',this.role);
    if (this.role === 'admin'){
      this.title = this.role;

    }
    if (this.role === 'user'){
      this.title = this.role;
    }
    // this.getUsers();

    // this.sideserv.sideBar.subscribe(result => {
    //   this.sideBarInfo = result  // this set's the username to the default observable value
      // console.log('sideBarinfo in dashboard', this.sideBarInfo)
    // });

    // this.sideserv.allsidebarChildren.subscribe(result => {
    //   this.allSidebarChildren = result;
    // });
    // console.log('all sidebar children in dashboard',this.allSidebarChildren);

    // this.dashboard = this.allSidebarChildren.filter(v=>v.title.toLowerCase() === 'dashboard')
    // console.log('dashboard data', this.dashboard)
  }



  getUsers(){
    this.dashboardServ.getUsers()
    .subscribe((response: any) => {
      // //console.log('dashboard',response);
      this.usersCount = response.data.stats.usersCount;
    });
  }

}
