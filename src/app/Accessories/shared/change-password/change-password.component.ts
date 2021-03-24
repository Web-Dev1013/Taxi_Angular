import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {LoginService} from '../../helpers/services/login.service';
import {ToastController} from '@ionic/angular';
import { Location } from '@angular/common';
import {LoaderService} from '../../helpers/services/loader.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public loginForm: FormGroup;
  isError = false;
  Error: string;
  touched = false;
  currentPassword: any;
  newPassword: any;
  errorMessages = {
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length.' },
      { type: 'maxlength', message: 'Password length.' }
    ],
    confirmpassword: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length.' },
      { type: 'maxlength', message: 'Password length.' },
    ],
  };
  constructor(
    private formBuilder: FormBuilder,
    private loginServ: LoginService,
    private toastCtrl: ToastController,
    private location: Location,
    private ionLoader: LoaderService,
  ) {
    {
      this.loginForm = this.formBuilder.group({
        currentPassword : new FormControl('', Validators.required),
        password: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)
        ])),
        confirmpassword: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)
        ])),
      }, {
        validators: this.password.bind(this)
      });
   }
  }

   get errorControl() {
    return this.loginForm.controls;
  }

  ngOnInit() {
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmpassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }


  changePassword(){
  //  //console.log('confirm Password');
  const passwords = {
    currentPassword : this.loginForm.value.currentPassword,
    newPassword : this.loginForm.value.confirmpassword
  };

  this.loginServ.ChangePassword({...passwords})
    .subscribe((response: any) => {
      if (response){
    // console.log('change pw response',response);
    this.isError = false;
    this.presentAlert(response.data.message, 'success');
      }

    },
    error => {
      this.ionLoader.HideLoader();
      this.isError = true;
     // this.Error = error.error.error.message || 'Something Went Wrong . Try again';
      // console.log('error',error);

    });
  }

  async presentAlert(message, color) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 700,
      position: 'top',
      animated : true,
      color,
      cssClass : 'my custom class'
    });
    toast.present();

    await toast.onDidDismiss().then(() => {
    this.loginForm.reset();
  });
}
back(){
  this.location.back();
}


}
