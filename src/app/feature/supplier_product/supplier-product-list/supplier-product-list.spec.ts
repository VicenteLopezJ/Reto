import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProductList } from './supplier-product-list';

describe('SupplierProductList', () => {
  let component: SupplierProductList;
  let fixture: ComponentFixture<SupplierProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierProductList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
