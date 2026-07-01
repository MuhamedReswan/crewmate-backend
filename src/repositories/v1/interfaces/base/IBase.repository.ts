import { FilterQuery } from "mongoose";

import { SortOption } from "../../../../types";
import { PaginatedResponse } from "../../../../types/pagination.type";

export interface IBaseRepository<T> {
  findOne(data: Partial<T>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  updateOne(filter: Partial<T>, updateData: Partial<T>): Promise<T | null>;
  deleteOne(filter: Partial<T>): Promise<T | null>;
  deleteMany(filter: Partial<T>): Promise<number>;
  findPaginated(
    baseFilter: FilterQuery<T>,
    page: number,
    limit: number,
    search?: string,
    searchFields?: (keyof T)[],
    sort?: SortOption<T>
  ): Promise<PaginatedResponse<T>>;

  findById(id: string, projection?: string | object): Promise<T | null>;
}
