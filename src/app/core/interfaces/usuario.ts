export interface Usuario {
  id: number;
  firstName: string;
  lastName: string;
  documentType: string;
  numberDocument: string;
  phoneNumber: string;
  email: string;
  registrationDate?: Date | null; 
  address: string;
  gender: string;
  totalSales: number;
  totalSaleAmount: number; 
  lastSaleDate: Date | null;    
  estado: string;
}
