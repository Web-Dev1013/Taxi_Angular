import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiSelectPopoverPageRoutingModule } from './multi-select-popover-routing.module';

import { MultiSelectPopoverPage } from './multi-select-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultiSelectPopoverPageRoutingModule
  ],
  declarations: [MultiSelectPopoverPage]
})
export class MultiSelectPopoverPageModule {}
