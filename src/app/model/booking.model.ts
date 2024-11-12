export interface Booking {
    id: string;
    serviceId: string;  
    userId: string;  
    startDate: string; 
    endDate: string;  
    peopleAmount: number;  
    preferences: string;
    estado: string; 
    totalPayed: number;
  }