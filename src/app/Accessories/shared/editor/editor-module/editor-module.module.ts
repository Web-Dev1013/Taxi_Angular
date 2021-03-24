import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorComponent} from '../editor.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import {IonCustomScrollbarModule} from '../../../../lib/ion-custom-scrollbar.module';



@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    IonCustomScrollbarModule
  ],
  exports: [EditorComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EditorModuleModule { }
