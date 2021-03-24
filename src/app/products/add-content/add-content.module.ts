import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContentPageRoutingModule } from './add-content-routing.module';

import { AddContentPage } from './add-content.page';
import {CommonHeaderModule} from '../../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../../lib/ion-custom-scrollbar.module';
import {EditorModuleModule} from '../../Accessories/shared/editor/editor-module/editor-module.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddContentPageRoutingModule,
    ReactiveFormsModule,
    CommonHeaderModule,
    IonCustomScrollbarModule,
    EditorModuleModule
  ],
  declarations: [AddContentPage]
})
export class AddContentPageModule {}
