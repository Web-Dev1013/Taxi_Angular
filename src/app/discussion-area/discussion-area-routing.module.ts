import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscussionAreaPage } from './discussion-area.page';

const routes: Routes = [
  {
    path: '',
    component: DiscussionAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscussionAreaPageRoutingModule {}
