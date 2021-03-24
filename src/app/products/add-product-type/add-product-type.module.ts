import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductTypePageRoutingModule } from './add-product-type-routing.module';

import { AddProductTypePage } from './add-product-type.page';
import {CommonHeaderModule} from '../../Accessories/shared/common-header.module';

import { MultiFileUploadComponent } from '../../components/multi-file-upload/multi-file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import {ImageUploadModule} from '../../Accessories/shared/image-upload/image-upload.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddProductTypePageRoutingModule,
    CommonHeaderModule,
    FileUploadModule,
    ImageUploadModule
  ],
  declarations: [AddProductTypePage , MultiFileUploadComponent]
})
export class AddProductTypePageModule {}
