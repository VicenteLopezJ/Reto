export interface SupplierProduct {
  id?: number;
  product_id: number;
  suppliers_id: number;
  order_quantity: number;
  price: number;
  subtotal: number;
  promotion: string;
  total: number;
  lead_time_days: number;
  state: string;
}
