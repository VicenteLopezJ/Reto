import { TestBed } from '@angular/core/testing';

import { SupplierProductService } from './supplier-product.service';

describe('SupplierProductService', () => {
  let service: SupplierProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
