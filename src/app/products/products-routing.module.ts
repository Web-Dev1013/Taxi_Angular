import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../Accessories/guards/auth.guard';

import { ProductsPage } from './products.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,

  },
  {
    path: 'product-type',
    loadChildren: () => import('./add-product-type/add-product-type.module').then( m => m.AddProductTypePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    loadChildren: () => import('./add-products/add-products.module').then( m => m.AddProductsPageModule),
    canActivate: [AuthGuard],

  },
  {
    path: ':id/edit',
    loadChildren: () => import('./edit-product/edit-product.module').then( m => m.EditProductPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: ':id1/create',
    loadChildren: () => import('./create-category/create-category.module').then( m => m.CreateCategoryPageModule),
    canActivate: [AuthGuard],

  },
  {
    path: ':id/edit/:id1',
    loadChildren: () => import('./edit-category/edit-category.module').then( m => m.EditCategoryPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: ':id/:id1/create-post',
    loadChildren: () => import('./add-content/add-content.module').then( m => m.AddContentPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: ':id/:id1/:id2/edit',
    loadChildren: () => import('./edit-content/edit-content.module').then( m => m.EditContentPageModule),
  },
  {
    path: ':id/:id1/:id2/edit-subcategory',
    loadChildren: () => import('./edit-subcategory/edit-subcategory.module').then( m => m.EditSubcategoryPageModule)
  },
  {
    path: 'add-subcategory',
    loadChildren: () => import('./add-subcategory/add-subcategory.module').then( m => m.AddSubcategoryPageModule)
  },
  {
    path: ':productSlug/:categorySlug/:postSlug/revisions',
    loadChildren: () => import('./revisions/revisions.module').then( m => m.RevisionsPageModule)
  },
  {
    path: ':productSlug/:categorySlug/:subCategorySlug/:postSlug/revisions',
    loadChildren: () => import('./revisions/revisions.module').then( m => m.RevisionsPageModule)
  }










];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
