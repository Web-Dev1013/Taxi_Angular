import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSubcategoryPageRoutingModule } from './edit-subcategory-routing.module';

import { EditSubcategoryPage } from './edit-subcategory.page';
import {CommonHeaderModule} from '../../Accessories/shared/common-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditSubcategoryPageRoutingModule,
    CommonHeaderModule
  ],
  declarations: [EditSubcategoryPage]
})
export class EditSubcategoryPageModule {}
