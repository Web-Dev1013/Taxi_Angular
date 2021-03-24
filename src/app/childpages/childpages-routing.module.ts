import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChildpagesPage } from './childpages.page';

const routes: Routes = [
  {
    path: '',
    component: ChildpagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildpagesPageRoutingModule {}
