import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProductPageRoutingModule } from './edit-product-routing.module';

import { EditProductPage } from './edit-product.page';
import {CommonHeaderModule} from '../../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../../lib/ion-custom-scrollbar.module';
import {EditorModuleModule} from '../../Accessories/shared/editor/editor-module/editor-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProductPageRoutingModule,
    CommonHeaderModule,
    ReactiveFormsModule,
    IonCustomScrollbarModule,
    EditorModuleModule
  ],
  declarations: [EditProductPage]
})
export class EditProductPageModule {}
