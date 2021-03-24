import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDashboardPageRoutingModule } from './user-dashboard-routing.module';

import { UserDashboardPage } from './user-dashboard.page';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../lib/ion-custom-scrollbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserDashboardPageRoutingModule,
    CommonHeaderModule,
    IonCustomScrollbarModule
  ],
  declarations: [UserDashboardPage]
})
export class UserDashboardPageModule {}
