export interface Cliente {
  id: number;
  firstName: string;
  lastName: string;
  birthdayDate: string; 
  documentType: string;
  documentNumber: string;
  phoneNumber: number;
  email: string;
  client_type: string;
  address: string;
  registrationDate: Date;  
  vip: boolean; 
  estado: string;
}