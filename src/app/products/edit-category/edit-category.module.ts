import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCategoryPageRoutingModule } from './edit-category-routing.module';

import { EditCategoryPage } from './edit-category.page';
import {CommonHeaderModule} from '../../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../../lib/ion-custom-scrollbar.module';
import {EditorModuleModule} from '../../Accessories/shared/editor/editor-module/editor-module.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCategoryPageRoutingModule,
    ReactiveFormsModule,
    CommonHeaderModule,
    IonCustomScrollbarModule,
    EditorModuleModule

  ],
  declarations: [EditCategoryPage],
})
export class EditCategoryPageModule {}
