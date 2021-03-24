import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePasswordPageRoutingModule } from './change-password-routing.module';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';
import { ChangePasswordPage } from './change-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ChangePasswordPageRoutingModule,
    CommonHeaderModule
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {}
