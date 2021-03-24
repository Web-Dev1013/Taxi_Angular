import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleOutputPipe } from '../title-output/title-output.pipe';

@NgModule({
  declarations: [
    TitleOutputPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TitleOutputPipe
  ]
})
export class PipesModule { }
