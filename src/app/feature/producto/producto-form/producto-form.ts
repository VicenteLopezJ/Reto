import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../core/interfaces/producto'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-producto-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.scss'
})
export class ProductoForm {
@Input() producto: Producto = {
    name: '',
    brand: '',
    categories: '',
    unit_measure: '',
    unit_price: null,
    expiration_date: '',
    state: 'A' // CAMBIO CLAVE: Inicializar 'state' a 'A' para que siempre tenga el valor correcto
  };

  @Output() guardar = new EventEmitter<Producto>();
  @Output() cerrar = new EventEmitter<void>();

  nameTouched = false;
  brandTouched = false;
  unitTouched = false;
  categoryTouched = false;
  priceTouched = false;
  dateTouched = false;
  minDate!: string;
  // CAMBIO CLAVE: 'stateTouched' ha sido eliminado por completo, ya no es necesario
  // stateTouched = false;

  constructor() {
    this.setMinMaxDates();
  }

  setMinMaxDates(): void {
    const today = new Date();

    const minAllowedDate = new Date(today);
    minAllowedDate.setFullYear(today.getFullYear() + 1);
    this.minDate = minAllowedDate.toISOString().split('T')[0];
  }

  onInputName(event: any) {
    const value = event.target.value;
    const sanitized = this.sanitizeInput(value);
    this.producto.name = sanitized;
    event.target.value = sanitized;
  }

  onInputBrand(event: any) {
    const value = event.target.value;
    const sanitized = this.sanitizeInput(value);
    this.producto.brand = sanitized;
    event.target.value = sanitized;
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
    this.producto.unit_price = value === '' ? null : (isNaN(parsedValue) ? null : parsedValue);
  }

  sanitizeInput(value: string): string {
    value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');
    value = value.replace(/ {3,}/g, '  ');
    value = value.replace(/^ +/, '');
    if (!/[A-Za-zÁÉÍÓÚáéíóÑñ]/.test(value)) {
      value = value.replace(/ +/g, ' ');
    }
    return value;
  }

  nameValid(): boolean {
    return (
      this.producto.name.trim().length > 0 &&
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: {1,2}[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(this.producto.name)
    );
  }

  brandValid(): boolean {
    return (
      this.producto.brand.trim().length > 0 &&
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: {1,2}[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(this.producto.brand)
    );
  }

  unitValid(): boolean {
    return ['L', 'K'].includes(this.producto.unit_measure);
  }

  categoryValid(): boolean {
    return ['FU', 'IN', 'FO', 'SE'].includes(this.producto.categories);
  }

  isPriceContentReady(): boolean {
    return this.producto.unit_price !== null && this.producto.unit_price !== undefined;
  }

  priceValid(): boolean {
    if (!this.priceTouched && (this.producto.unit_price === null || this.producto.unit_price === undefined)) {
      return true;
    }
    return typeof this.producto.unit_price === 'number' && !isNaN(this.producto.unit_price) && this.producto.unit_price > 0;
  }

  expirationDateValid(): boolean {
    if (!this.producto.expiration_date) {
      return false;
    }
    const selectedDate = new Date(this.producto.expiration_date);
    const minDateObj = new Date(this.minDate);
    selectedDate.setHours(0, 0, 0, 0);
    minDateObj.setHours(0, 0, 0, 0);

    return selectedDate >= minDateObj;
  }

  // CAMBIO CLAVE: 'stateValid()' ha sido eliminado por completo
  // stateValid(): boolean {
  //   return ['I', 'A'].includes(this.producto.state);
  // }

  guardarProducto() {
    this.nameTouched = true;
    this.brandTouched = true;
    this.unitTouched = true;
    this.categoryTouched = true;
    this.priceTouched = true;
    this.dateTouched = true;
    // CAMBIO CLAVE: 'this.stateTouched = true;' ha sido eliminado
    // this.stateTouched = true;

    if (
      this.nameValid() &&
      this.brandValid() &&
      this.unitValid() &&
      this.categoryValid() &&
      this.priceValid() &&
      this.expirationDateValid()
      // CAMBIO CLAVE: '&& this.stateValid()' ha sido eliminado de la condición de guardar
    ) {
      this.guardar.emit(this.producto);
    }
  }

  cerrarFormulario() {
    this.cerrar.emit();
  }
}
