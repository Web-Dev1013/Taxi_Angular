import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, NavController, MenuController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import sidebarJson from './Accessories/helpers/jsonFiles/child.json';
import adminSidebarJson from './Accessories/helpers/jsonFiles/admin_sidebar.json';
import { ActivatedRoute, NavigationError } from '@angular/router';
import { SidebarDataService } from './Accessories/helpers/services/sidebar-data.service';
import { Router, NavigationExtras, Event } from '@angular/router';
import { LoginService } from './Accessories/helpers/services/login.service';
import { StorageService } from './Accessories/helpers/services/storage.service';
import { Title } from '@angular/platform-browser';
// import {role} from '../environments/environment';


type CurrentPlatform = 'browser' | 'native';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  private currentPlatform: CurrentPlatform;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private activatedRoute: ActivatedRoute,
    private sideserv: SidebarDataService,
    private router: Router,
    public loadingCtrl: LoadingController,
    public loginServ: LoginService,
    public storageserv: StorageService,
    private titleService: Title,
  ) {
    this.initializeApp();
    // x this.registerUser();
  }

  initializeApp() {
    this.platform.ready()
    .then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    })
    .catch((error) => {
      console.log('sorry Not availbale---', error);
    });
  }

  ngOnInit() {
    this.router.events.subscribe((e: Event) => {
      if (e instanceof NavigationError) {
        this.router.navigate(['/login']);
        // .then(
        //   () => console.clear()
        // );
      }

      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }



  public setTitle(newTitle: string) {
    // console.log('current title:::::' + this.titleService.getTitle());
    this.titleService.setTitle(newTitle);
  }
  // registerUser(){
  //   const data = {
  //     firstName: "super",
  //     lastName: "user",
  //     email: "nitikav1996@gmail.com",
  //     password: "secret",
  //     infusionSoftId: "4508112"
  //   }
  //   this.loginServ.register({...data}).subscribe((response : any) =>{
  //     console.log(response);
  //   })
  // }
}



