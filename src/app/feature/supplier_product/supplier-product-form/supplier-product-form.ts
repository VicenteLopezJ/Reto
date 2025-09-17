import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierProduct } from '../../../core/interfaces/supplier-product';

@Component({
  selector: 'app-supplier-product-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-product-form.html',
  styleUrl: './supplier-product-form.scss'
})
export class SupplierProductForm implements OnInit{
@Input() supplierProduct: SupplierProduct = {
    product_id: 0,
    suppliers_id: 0,
    order_quantity: 0,
    price: 0,
    subtotal: 0,
    promotion: 'Sin promociones',
    total: 0,
    lead_time_days: 0,
    state: 'A'
  };

  @Output() guardar = new EventEmitter<SupplierProduct>();
  @Output() cerrar = new EventEmitter<void>();

  productIdTouched = false;
  supplierIdTouched = false;
  orderQuantityTouched = false;
  priceTouched = false;
  promotionTouched = false; 
  leadTimeDaysTouched = false;

  constructor() { }

  ngOnInit(): void {
    if (this.supplierProduct.promotion === null || this.supplierProduct.promotion.trim() === '') {
      this.supplierProduct.promotion = 'Sin promociones';
    }
    this.calculateSubtotalAndTotal();
  }

  onInputPrice(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9.,]/g, '');
    value = value.replace(/,/g, '.');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    event.target.value = value;
    const parsedValue = parseFloat(value);
    this.supplierProduct.price = value === '' ? 0 : (isNaN(parsedValue) ? 0 : parsedValue);
    this.calculateSubtotalAndTotal();
  }

  calculateSubtotalAndTotal(): void {
    const quantity = this.supplierProduct.order_quantity || 0;
    const price = this.supplierProduct.price || 0;
    const promotion = this.supplierProduct.promotion;

    const calculatedSubtotal = quantity * price;
    this.supplierProduct.subtotal = calculatedSubtotal;

    let calculatedTotal = calculatedSubtotal;

    if (promotion === 'Descuento 10%') {
      calculatedTotal = calculatedSubtotal * 0.90;
    }

    this.supplierProduct.total = calculatedTotal;
  }

  productIdValid(): boolean {
    return typeof this.supplierProduct.product_id === 'number' && this.supplierProduct.product_id > 0;
  }

  supplierIdValid(): boolean {
    return typeof this.supplierProduct.suppliers_id === 'number' && this.supplierProduct.suppliers_id > 0;
  }

  orderQuantityValid(): boolean {
    return typeof this.supplierProduct.order_quantity === 'number' && this.supplierProduct.order_quantity > 0;
  }

  isPriceContentReady(): boolean {
    return this.supplierProduct.price !== null && this.supplierProduct.price !== undefined;
  }

  priceValid(): boolean {
    if (!this.priceTouched && (this.supplierProduct.price === null || this.supplierProduct.price === undefined)) {
      return true;
    }
    return typeof this.supplierProduct.price === 'number' && !isNaN(this.supplierProduct.price) && this.supplierProduct.price > 0;
  }

  isSubtotalContentReady(): boolean {
    return this.supplierProduct.subtotal !== null && this.supplierProduct.subtotal !== undefined;
  }

  promotionValid(): boolean {
    return this.supplierProduct.promotion === 'Descuento 10%' || this.supplierProduct.promotion === 'Sin promociones';
  }

  isTotalContentReady(): boolean {
    return this.supplierProduct.total !== null && this.supplierProduct.total !== undefined;
  }

  leadTimeDaysValid(): boolean {
    return typeof this.supplierProduct.lead_time_days === 'number' && this.supplierProduct.lead_time_days > 0;
  }

  guardarSupplierProduct() {
    this.productIdTouched = true;
    this.supplierIdTouched = true;
    this.orderQuantityTouched = true;
    this.priceTouched = true;
    this.promotionTouched = true;
    this.leadTimeDaysTouched = true;

    if (
      this.productIdValid() &&
      this.supplierIdValid() &&
      this.orderQuantityValid() &&
      this.priceValid() &&
      this.promotionValid() &&
      this.leadTimeDaysValid()
    ) {
      if (this.supplierProduct.promotion === 'Sin promociones') {
        this.supplierProduct.promotion = '';
      }
      this.guardar.emit(this.supplierProduct);
    }
  }

  cerrarFormulario() {
    this.cerrar.emit();
  }
}
