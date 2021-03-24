import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../Accessories/guards/auth.guard';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    // children : [
    //   {
    //     path: 'product-groups/:id',
    //     loadChildren: () => import('../pages/pages.module').then( m => m.PagesPageModule),
    //     canActivate: [AuthGuard]
    //   },
    //   {
    //     path: 'product-groups/:id/:id1',
    //     loadChildren: () => import('../childpages/childpages.module').then( m => m.ChildpagesPageModule),
    //     canActivate: [AuthGuard]
    //   },

    //   {
    //     path: 'dashboard',
    //     loadChildren: () => import('../user-dashboard/user-dashboard.module').then( m => m.UserDashboardPageModule),
    //     canActivate: [AuthGuard]
    //   },
    //   {
    //     path: '',
    //     redirectTo: '/menu/dashboard',
    //     pathMatch: 'full'
    //   },
    //   {
    //     path: 'products',
    //     loadChildren: () => import('../products/products.module').then( m => m.ProductsPageModule),
    //     canActivate: [AuthGuard]
    //   },
    //   {
    //     path: 'users',
    //     loadChildren: () => import('../users/users.module').then( m => m.UsersPageModule),
    //     canActivate: [AuthGuard]
    //   },
    //   {
    //     path: 'discussion-area',
    //     loadChildren: () => import('../discussion-area/discussion-area.module').then( m => m.DiscussionAreaPageModule)
    //   },
    //   {
    //     path: 'support',
    //     loadChildren: () => import('../support/support.module').then( m => m.SupportPageModule)
    //   },
    //   {
    //     path: '404',
    //     loadChildren: () => import('../doesnot-exist/doesnot-exist.module').then( m => m.DoesnotExistPageModule)
    //   },
    //   // {
    //   //   path: 'user-dashboard',
    //   //   loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule),
    //   //   canActivate: [AuthGuard]
    //   // },

    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
