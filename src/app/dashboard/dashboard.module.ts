import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';
import { TabsModule } from 'ngx-bootstrap/tabs';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    CommonHeaderModule,
    TabsModule.forRoot()
  ],
  declarations: [DashboardPage],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPageModule {}
