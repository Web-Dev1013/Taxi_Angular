import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoesnotExistPage } from './doesnot-exist.page';

const routes: Routes = [
  {
    path: '',
    component: DoesnotExistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoesnotExistPageRoutingModule {}
