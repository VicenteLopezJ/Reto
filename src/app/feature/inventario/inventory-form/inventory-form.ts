import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-form.html',
  styleUrl: './inventory-form.scss'
})
export class InventoryForm {
@Input() inventory: any = {};
  @Input() existingProductIds: number[] = []; // lista de productos existentes
  @Output() guardar = new EventEmitter<any>();
  @Output() cerrar = new EventEmitter<void>();

  touched = {
    products_id: false,
    quantity: false,
    batch: false,
    specs: false,
    location: false,
    entry_date: false,
    last_updated: false,
    status: false
  };

  today: string;

  constructor() {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
  }

  guardarInventario() {
    this.markAllTouched();

    if (
      this.productsIdValid() &&
      this.quantityValid() &&
      this.batchValid() &&
      this.specsValid() &&
      this.locationValid() &&
      this.entryDateValid() &&
      this.lastUpdatedValid() &&
      this.statusValid()
    ) {
      this.guardar.emit(this.inventory);
    }
  }

  markAllTouched() {
    for (const key in this.touched) {
      this.touched[key as keyof typeof this.touched] = true;
    }
  }

  productsIdValid(): boolean {
    const id = this.inventory.products_id;
    const max = Math.max(...this.existingProductIds, 0);
    return id && id > max;
  }

  quantityValid(): boolean {
    return this.inventory.quantity_available > 0;
  }

  batchValid(): boolean {
    return this.inventory.batch_number?.trim().length > 0;
  }

  specsValid(): boolean {
    return this.inventory.specs?.trim().length > 0;
  }

  locationValid(): boolean {
    return this.inventory.location?.trim().length > 0;
  }

  entryDateValid(): boolean {
    return !!this.inventory.entry_date;
  }

  lastUpdatedValid(): boolean {
    return !!this.inventory.last_updated;
  }

  statusValid(): boolean {
    return ['DIS', 'RES', 'TRA', 'DAÑ'].includes(this.inventory.status);
  }

  cerrarFormulario() {
    this.cerrar.emit();
  }
  
}
