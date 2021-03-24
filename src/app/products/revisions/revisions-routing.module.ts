import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevisionsPage } from './revisions.page';

const routes: Routes = [
  {
    path: '',
    component: RevisionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisionsPageRoutingModule {}
