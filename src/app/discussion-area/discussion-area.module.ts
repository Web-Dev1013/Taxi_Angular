import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscussionAreaPageRoutingModule } from './discussion-area-routing.module';

import { DiscussionAreaPage } from './discussion-area.page';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../lib/ion-custom-scrollbar.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscussionAreaPageRoutingModule,
    CommonHeaderModule,
    IonCustomScrollbarModule
  ],
  declarations: [DiscussionAreaPage]
})
export class DiscussionAreaPageModule {}
