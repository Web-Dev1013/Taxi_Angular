import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../lib/ion-custom-scrollbar.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    CommonHeaderModule,
    IonCustomScrollbarModule

  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
