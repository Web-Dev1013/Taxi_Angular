import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserFormComponent} from './user-form.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [UserFormComponent]
})
export class UserFormModule { }
