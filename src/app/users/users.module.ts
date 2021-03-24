import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {IonCustomScrollbarModule} from '../lib/ion-custom-scrollbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    CommonHeaderModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    IonCustomScrollbarModule
  ],
  declarations: [UsersPage]
})
export class UsersPageModule {}
