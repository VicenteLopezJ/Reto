import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProductForm } from './supplier-product-form';

describe('SupplierProductForm', () => {
  let component: SupplierProductForm;
  let fixture: ComponentFixture<SupplierProductForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierProductForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierProductForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
