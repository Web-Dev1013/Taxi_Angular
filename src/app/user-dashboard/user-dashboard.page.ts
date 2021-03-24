import { Component, OnInit } from '@angular/core';
import {SidebarDataService} from '../Accessories/helpers/services/sidebar-data.service';
import {DashboardService} from '../Accessories/helpers/services/dashboard.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
})
export class UserDashboardPage implements OnInit {
  role: any = localStorage.getItem('role');
  title: string;
  sideBarInfo: any;
  allSidebarChildren: any;
  dashboard: any;
  usersCount: any;
  public data: any;
  userName: string;
  Error: any;
  isError = false;
  constructor(private activatedRoute: ActivatedRoute , private sideserv: SidebarDataService , private dashboardServ: DashboardService) {
    // console.log('dashboard constructor');
    // console.log('data',this.sideserv.data);
    this.disableBack();
  }

  ngOnInit() {
    // this.disableBack();
    if (this.role === 'admin'){
     this.adminDashboard();
    }
    else if (this.role === 'user')
    {
      this.userName = localStorage.getItem('username');
      this.userDashboard();
    }

  }

  disableBack(){
    window.history.forward();
    // history.go(1)
  }


  userDashboard(){
    this.title = this.role;
      // console.log('title',this.title);

  }
  adminDashboard(){
    this.title = this.role;
    // console.log('title',this.title);
    this.getUsers();
  }
  getUsers(){
    this.dashboardServ.getUsers()
    .subscribe((response: any) => {
      // console.log('dashboard',response);
      this.usersCount = response.data.stats.usersCount;
    },
    error => {
      // this.Error = error.error.error.message;
      this.isError = true;
    });
  }

}
