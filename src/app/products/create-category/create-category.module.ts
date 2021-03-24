import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCategoryPageRoutingModule } from './create-category-routing.module';

import { CreateCategoryPage } from './create-category.page';
import {CommonHeaderModule} from '../../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../../lib/ion-custom-scrollbar.module';
import {EditorModuleModule} from '../../Accessories/shared/editor/editor-module/editor-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreateCategoryPageRoutingModule,
    CommonHeaderModule,
    IonCustomScrollbarModule,
    EditorModuleModule

  ],
  declarations: [CreateCategoryPage]
})
export class CreateCategoryPageModule {}
