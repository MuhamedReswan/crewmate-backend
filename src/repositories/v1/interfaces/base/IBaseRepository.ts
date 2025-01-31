
export interface IBaseRepository<T> {
    findOne(data: Partial<T>): Promise<T | null>;
    create(data: Partial<T>): Promise<T>
    updateOne(filter: Partial<T>, updateData: Partial<T>): Promise<T | null>
    deleteOne(filter: Partial<T>): Promise<T | null>
    deleteMany(filter:Partial<T>): Promise<Number>
    
  }