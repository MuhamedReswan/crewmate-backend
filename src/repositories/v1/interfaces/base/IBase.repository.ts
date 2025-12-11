import { PaginatedResponse } from "../../../../types/pagination.type";

export interface IBaseRepository<T> {
    findOne(data: Partial<T>): Promise<T | null>;
    create(data: Partial<T>): Promise<T>
    updateOne(filter: Partial<T>, updateData: Partial<T>): Promise<T | null>
    deleteOne(filter: Partial<T>): Promise<T | null>
    deleteMany(filter:Partial<T>): Promise<Number>
findPaginated(
    // page: number,
    // limit: number,
    // search?: string,
    // isBlocked?:boolean,
    // searchFields?: (keyof T)[]

      baseFilter: Partial<T>,
    page: number,
    limit: number,
    search?: string,
    // isBlocked?:boolean,
    searchFields?: (keyof T)[],
  ): Promise<PaginatedResponse<T>>

  updateById(
  id: string,
  updateData: Partial<T>
): Promise<T | null>

findById(id: string, projection?: string | object): Promise<T | null>
    
  }