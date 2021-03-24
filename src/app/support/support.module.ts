import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupportPageRoutingModule } from './support-routing.module';

import { SupportPage } from './support.page';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../lib/ion-custom-scrollbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupportPageRoutingModule,
    CommonHeaderModule,
    IonCustomScrollbarModule
  ],
  declarations: [SupportPage]
})
export class SupportPageModule {}
