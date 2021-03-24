import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSubcategoryPage } from './edit-subcategory.page';

const routes: Routes = [
  {
    path: '',
    component: EditSubcategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSubcategoryPageRoutingModule {}
