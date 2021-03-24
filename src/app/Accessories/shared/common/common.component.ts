import { Component, OnInit, NgZone } from '@angular/core';
import { StorageService } from '../../helpers/services/storage.service';
import { LoginService } from '../../helpers/services/login.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MenuController , Platform} from '@ionic/angular';
import {baseUrl} from '../../../../environments/environment';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss'],
})
export class CommonComponent implements OnInit {
  baseUrl: string = baseUrl;
  image: any;
  selectOptions = {
    interface: 'popover',
  };

  username: string = localStorage.getItem('username');
  email: string = localStorage.getItem('email');
  open: boolean;
  width: number;
  constructor(
    private storage: Storage,
    private storageserv: StorageService,
    private router: Router,
    private loginserv: LoginService,
    private menuCtrl: MenuController,
    private ngZone: NgZone,
    private platform: Platform
  ) {
    // this.username = this.storageserv.get("username");
    // this.email = this.storageserv.get("email");

    platform.ready().then(() => {
      this.width = platform.width();
      this.image = `${baseUrl}${this.loginserv.userImage}`;
      this.open = this.width > 1000 ? true : false;
      // console.log('Width:' + platform.width());
      // console.log('Height: ' + platform.height());
    });

  }
  ngOnInit() {
    this.getUserDetails();
  }


   getUserDetails(){

     this.storage.get('userData')
      .then((data) => {
        // console.log('data in header',data);
        this.username = data.firstName + ' ' + data.lastName;
        this.email = data.email;
        this.image = `${baseUrl}${data.image}` || `${baseUrl}${this.loginserv.userImage}`;
        // console.log('image',this.image);
        //// console.log('userDetails in settings',this.image);
      });
  }
  logout() {
   // //console.log("this.username after login", this.storageserv.get("username"));

    this.loginserv.logout();
    setTimeout(() => {
    }, 5000);
  }
  ToggleMenu() {
    if (this.menuCtrl.close && this.width < 1000){

      this.open = false;
    }
    this.open = !this.open;
    this.menuCtrl.enable(this.open).then(() => {
      this.storageserv.remove('ionMenu');
    });
  }
  goToSettings() {
    this.router.navigate([`/settings`]);
  }
}
