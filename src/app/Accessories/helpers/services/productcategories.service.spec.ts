import { TestBed } from '@angular/core/testing';

import { ProductcategoriesService } from './productcategories.service';

describe('ProductcategoriesService', () => {
  let service: ProductcategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductcategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
