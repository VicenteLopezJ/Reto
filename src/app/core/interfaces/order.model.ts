export interface OrderDetail {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  total: number;
  comments: string;
}

export interface Order {
  id: number;
  clientId: number;
  userId: number;
  orderDate: Date;       
  deliveryDate: Date;    
  deliveryAddress: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  notes: string;
  createdAt?: Date;      
  updatedAt?: Date;    
  orderDetails: OrderDetail[];
}
