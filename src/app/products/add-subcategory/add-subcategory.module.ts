import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSubcategoryPageRoutingModule } from './add-subcategory-routing.module';

import { AddSubcategoryPage } from './add-subcategory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSubcategoryPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddSubcategoryPage]
})
export class AddSubcategoryPageModule {}
