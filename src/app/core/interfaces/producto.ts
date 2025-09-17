export interface Producto {
  id?: number;
  name: string;
  brand: string;
  categories: string;
  unit_measure: string;
  unit_price: number| null;
  expiration_date: string;
  state: string;
}
