import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductsPageRoutingModule } from './add-products-routing.module';

import { AddProductsPage } from './add-products.page';
import {CommonHeaderModule} from '../../Accessories/shared/common-header.module';
import { TagInputModule } from 'ngx-chips';
import {IonCustomScrollbarModule} from '../../lib/ion-custom-scrollbar.module';
import {EditorModuleModule} from '../../Accessories/shared/editor/editor-module/editor-module.module';
import {HttpErrorInterceptor} from '../../Accessories/helpers/services/interceptors/httperrorinterceptor.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProductsPageRoutingModule,
    ReactiveFormsModule,
    CommonHeaderModule,
    TagInputModule,
    IonCustomScrollbarModule,
    EditorModuleModule
  ],
  providers: [HttpErrorInterceptor],
  declarations: [AddProductsPage]
})
export class AddProductsPageModule {}
