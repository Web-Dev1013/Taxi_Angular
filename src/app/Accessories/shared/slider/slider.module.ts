import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SliderComponent} from './slider.component';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';

@NgModule({
  declarations: [
    SliderComponent
  ],
  imports: [
    CommonModule,
    PipesModule
  ],
  exports : [SliderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderModule { }
