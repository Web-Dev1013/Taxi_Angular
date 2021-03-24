import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,  ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditContentPageRoutingModule } from './edit-content-routing.module';

import { EditContentPage } from './edit-content.page';
import {CommonHeaderModule} from '../../Accessories/shared/common-header.module';
import {IonCustomScrollbarModule} from '../../lib/ion-custom-scrollbar.module';
import {EditorModuleModule} from '../../Accessories/shared/editor/editor-module/editor-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditContentPageRoutingModule,
    CommonHeaderModule,
    ReactiveFormsModule,
    IonCustomScrollbarModule,
    EditorModuleModule
  ],
  declarations: [EditContentPage]
})
export class EditContentPageModule {}
