import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {Storage} from '@ionic/storage';
import { StorageService } from '../Accessories/helpers/services/storage.service';
import {ProfileService} from '../Accessories/helpers/services/profile.service';
import {ToastService} from '../Accessories/helpers/services/toast.service';
import {LoginService} from '../Accessories/helpers/services/login.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(
    private location: Location,
    private ionicStorage: Storage,
    private profileServ: ProfileService,
    private storageserv: StorageService,
    private toastServ: ToastService,
    private loginServ: LoginService
    ) {
      this.getUserDetails();
     }

  userDetails: any;
  details: any;
  updatedDetails: any;
  image: any;
  showChangePassword = false;
  disabled = true;
0;

  ngOnInit() {

  }

  async getUserDetails(){
    await this.ionicStorage.get('userData')
      .then((data) => {
        this.userDetails = data;
        this.image = data.image;
        // //console.log('userDetails in settings',this.image);
      });
  }
  getFormValue(event){
    //// //console.log('event',event);
    this.updatedDetails = event;

  }
  getUserProfile(image){
    //// //console.log('image',image);
    this.image = image.fileToUpload;
  }
  async onSubmit(){
    //// //console.log('details',this.updatedDetails);
    const formData = new FormData();
    formData.append('image', this.image ? this.image : '');
    formData.append('email', this.updatedDetails ?
      this.updatedDetails.email : this.userDetails.email);
    formData.append('firstName', this.updatedDetails ?
      this.updatedDetails.firstName : this.userDetails.firstName);
    formData.append('lastName', this.updatedDetails ?
      this.updatedDetails.lastName : this.userDetails.lastName);

    await this.profileServ.updateProfile(formData)
      .subscribe((response: any) => {
        // console.log('response on updating', response);
        if (response){
          this.toastServ.presentToast(response.data.message, 'success');
          this.storageserv.set('username', response.data.firstName + '' + response.data.lastName);
          this.ionicStorage.set('userData', response.data.data);
          console.log('image', response.data.data.image);
          this.loginServ.userImage = response.data.data.image;
          console.log('response.data', response.data);

        }
        window.location.reload();
      });
  }
  changePassword(){
    this.showChangePassword = !this.showChangePassword;
  }

  back(){
    this.location.back();
  }
  checkFormValid(value){
    this.disabled = value;
    // console.log('disabled', value);
  }
}
