export interface IDatabase<T> {
    init(): Promise<void>; 
    add(item: T): Promise<string>; 
    getAll(): Promise<T[]>;    
    update(item: T): Promise<void>;  
    delete(id: string): Promise<void>; 
  }