import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';
import {ChangePasswordModule} from '../Accessories/shared/change-password/change-password.module';
import {UserFormModule} from '../Accessories/shared/user-form/user-form.module';
import {ImageUploadModule} from '../Accessories/shared/image-upload/image-upload.module';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    ChangePasswordModule,
    UserFormModule,
    ImageUploadModule,
    CommonHeaderModule
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
