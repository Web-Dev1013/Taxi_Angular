import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {LoginService} from '../Accessories/helpers/services/login.service';
import {ToastController} from '@ionic/angular';
import { Location } from '@angular/common';
import {LoaderService} from '../Accessories/helpers/services/loader.service'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  public loginForm: FormGroup;
  isError : boolean =false;
  Error : string;
  touched : boolean = false
  error_messages ={
    'password': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],
    'confirmpassword': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' },
    ],
  }
  constructor(
    private formBuilder:FormBuilder,
    private loginServ : LoginService,
    private toastCtrl : ToastController,
    private Location : Location,
    private ionLoader : LoaderService,
  ) {
    {
      this.loginForm = this.formBuilder.group({
        currentPassword : new FormControl('',Validators.required),
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
  currentPassword
  newPassword

  changePassword(){
  //  console.log('confirm Password');
  this.ionLoader.showLoader('Changing Your password..')
  const passwords = {
    currentPassword : this.loginForm.value.currentPassword,
    newPassword : this.loginForm.value.confirmpassword
  }
    this.loginServ.ChangePassword({...passwords})
    .subscribe((response:any)=>{
      if(response){
    this.ionLoader.HideLoader();
    console.log('response',response);   
    this.isError = false   
    this.presentAlert(response.data.message);
      }
    
    },
    error=>{
      this.ionLoader.HideLoader();
      this.isError = true;
     // this.Error = error.error.error.message || 'Something Went Wrong . Try again';
      console.log('error',error);
      
    })
  }

  async presentAlert(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 700,
      position: 'top',
      animated : true,
      color : "primary",
      cssClass : "my custom class"
    });
    toast.present();
  
  await toast.onDidDismiss().then(()=>{
    this.loginForm.reset();
  }); 
}
back(){
  this.Location.back();
}

}
