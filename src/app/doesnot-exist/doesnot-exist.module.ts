import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoesnotExistPageRoutingModule } from './doesnot-exist-routing.module';

import { DoesnotExistPage } from './doesnot-exist.page';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoesnotExistPageRoutingModule,
    CommonHeaderModule
  ],
  declarations: [DoesnotExistPage]
})
export class DoesnotExistPageModule {}
