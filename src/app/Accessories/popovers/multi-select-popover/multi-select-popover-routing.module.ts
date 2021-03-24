import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultiSelectPopoverPage } from './multi-select-popover.page';

const routes: Routes = [
  {
    path: '',
    component: MultiSelectPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiSelectPopoverPageRoutingModule {}
