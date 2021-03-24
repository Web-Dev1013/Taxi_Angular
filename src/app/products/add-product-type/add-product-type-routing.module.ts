import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProductTypePage } from './add-product-type.page';

const routes: Routes = [
  {
    path: '',
    component: AddProductTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProductTypePageRoutingModule {}
