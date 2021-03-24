import { TestBed } from '@angular/core/testing';

import { GalleryImageServiceService } from './gallery-image-service.service';

describe('GalleryImageServiceService', () => {
  let service: GalleryImageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalleryImageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
