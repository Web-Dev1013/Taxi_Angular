import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevisionsPageRoutingModule } from './revisions-routing.module';

import { RevisionsPage } from './revisions.page';
import {CommonHeaderModule} from '../../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../../lib/ion-custom-scrollbar.module';
import { NgxTextDiffModule } from 'ngx-text-diff';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevisionsPageRoutingModule,
    CommonHeaderModule,
    IonCustomScrollbarModule,
    NgxTextDiffModule
  ],
  declarations: [
    RevisionsPage,
  ]
})
export class RevisionsPageModule {}
