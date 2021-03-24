import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Accessories/guards/auth.guard';
import {LoginGuard} from './Accessories/guards/loginGuard.guard';
import { MenuPage } from './menu/menu.page';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module')
      .then(m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./menu/menu.module')
      .then(m => m.MenuPageModule)
  },
  {
    path: 'popover',
    loadChildren: () => import('./Accessories/popovers/popover/popover.module')
      .then(m => m.PopoverPageModule)
  },
  {
    path: 'multi-select-popover',
    loadChildren: () => import('./Accessories/popovers/multi-select-popover/multi-select-popover.module')
      .then(m => m.MultiSelectPopoverPageModule)
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'product-groups/:product-group',
        loadChildren: () => import('./pages/pages.module')
          .then(m => m.PagesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'product-groups/:product-group/:product',
        loadChildren: () => import('./childpages/childpages.module')
          .then(m => m.ChildpagesPageModule),
        canActivate: [AuthGuard]
      },

// Added three new paths for child pages for the necessary url formation (Rishi)
      {
        path: 'product-groups/:product-group/:product/:category',
        loadChildren: () => import('./childpages/childpages.module')
          .then(m => m.ChildpagesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'product-groups/:product-group/:product/:category/:content',
        loadChildren: () => import('./childpages/childpages.module')
          .then(m => m.ChildpagesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'product-groups/:product-group/:product/:category/:content/:sub-content',
        loadChildren: () => import('./childpages/childpages.module')
          .then(m => m.ChildpagesPageModule),
        canActivate: [AuthGuard]
      },
// Ends here

      {
        path: 'dashboard',
        loadChildren: () => import('./user-dashboard/user-dashboard.module')
          .then(m => m.UserDashboardPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module')
          .then(m => m.ProductsPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module')
          .then(m => m.UsersPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'discussion-area',
        loadChildren: () => import('./discussion-area/discussion-area.module')
          .then(m => m.DiscussionAreaPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'support',
        loadChildren: () => import('./support/support.module')
          .then(m => m.SupportPageModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module')
          .then(m => m.SettingsPageModule),
          canActivate: [AuthGuard]
      },
      {
        path: '404',
        loadChildren: () => import('./doesnot-exist/doesnot-exist.module')
          .then(m => m.DoesnotExistPageModule)
      },
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules,
        onSameUrlNavigation: 'ignore'
      })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
