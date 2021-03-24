import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReadMoreComponent} from './read-more.component';


@NgModule({
  declarations: [ReadMoreComponent],
  imports: [
    CommonModule
  ],
  exports: [ReadMoreComponent]
})
export class ReadMoreModule { }
