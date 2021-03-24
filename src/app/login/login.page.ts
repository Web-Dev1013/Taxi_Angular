import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { LoginService } from '../Accessories/helpers/services/login.service';
import { Storage } from '@ionic/storage';
import { StorageService } from '../Accessories/helpers/services/storage.service';
import { LoaderService } from '../Accessories/helpers/services/loader.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  public returnUrl: any;
  constructor(
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private loginServ: LoginService,
    private storage: Storage,
    private storageSrv: StorageService,
    private loadingCtrl: LoadingController,
    public ionLoader: LoaderService
  ) {
    if (this.activatedRoute.snapshot.queryParams.returnUrl){
      this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/';
    }

    // console.log('return URL', this.returnUrl);
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }
  get errorControl() {
    return this.loginForm.controls;
  }
  userData: any;
  loginError: any;
  isError = false;
  touched = false;
  public loginForm: FormGroup;
  loader: any;
  ngOnInit() {
    this.loginForm.reset();
  }

  onClickSubmit() {
    this.ionLoader.showLoader('Logging In');
    //// //console.log('username', this.loginForm.value.username);
    //// //console.log('password', this.loginForm.value.password);
    const data = {
      email: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.loginServ.login({ ...data })
      .subscribe((response: any) => {

        this.userData = response;
        console.log('login', response);
        this.storage.set('userData', this.userData.data.user);
        // to check if we are getting token or not
        if (this.userData.data.token) {
          this.loginServ.firstName = this.userData.data.user.firstName;
          this.loginServ.lastName = this.userData.data.user.lastName;
          this.loginServ.email = this.userData.data.user.email;
          this.loginServ.userImage = this.userData.data.user.image;
          this.storageSrv.set('token', this.userData.data.token);
          this.storageSrv.set('role', this.userData.data.user.role);
          this.storageSrv.set('image', this.userData.data.user.image);
          this.storageSrv.set('userId', this.userData.data.user.id);
          this.storageSrv.set('email', this.userData.data.user.email);
          this.storageSrv.set('username', this.userData.data.user.firstName + ' ' + this.userData.data.user.lastName);
          this.storageSrv.set('tags', JSON.stringify(this.userData.data.user.tags));
          if (this.returnUrl){
            this.route.navigate([`${this.returnUrl}`]);
          }
          else
          {
            this.route.navigate([`/dashboard`]);
          }

          this.isError = false;
        }
      }, (error) => {
        this.isError = true;
        this.loginError = error;
        // //console.log('error',this.loginError);

      });
  }
  remove() {
    this.isError = false;
  }
  ionViewWillEnter() {

    // this.menuCtrl.enable(false);
  }

  // this is to show menu after the user navigates from login to dashboard
  ionViewWillLeave() {
    // to enable menu.
    this.menuCtrl.enable(true);

  }
  loaderOnOperations() {
    this.loader = this.loadingCtrl.create({
      message: 'please wait ...',
      showBackdrop: false,
      cssClass: 'my-custom-class'
    }).then((res) => {
      res.present();
      res.onDidDismiss().then((dis) => {
        //     ////console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });
  }
  ngOnDestroy() {
    // console.log('login onDestroy');

  }


}
