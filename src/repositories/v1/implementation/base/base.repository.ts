import { FilterQuery, Model } from "mongoose";
import { injectable } from "tsyringe";

import { PaginatedResponse } from "../../../../types/pagination.type";
import { SortOption } from "../../../../types/type";
import logger from "../../../../utils/logger.util";
import { IBaseRepository } from "../../interfaces/base/IBase.repository";

@injectable()
export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected _model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const createdDocument = await this._model.create(data);
      return createdDocument;
    } catch (error) {
      logger.error("Error creating document:", error);
      throw error;
    }
  }

  async findOne(filter: Partial<T>, projection?: string | object): Promise<T | null> {
    try {
      const document = await this._model.findOne(filter, projection).exec();
      return document;
    } catch (error) {
      logger.error("Error finding document:", error);
      throw error;
    }
  }

  async findById(id: string, projection?: string | object): Promise<T | null> {
    try {
      const document = await this._model.findById(id, projection).exec();
      return document;
    } catch (error) {
      logger.error("Error finding document by ID:", error);
      throw error;
    }
  }

  async findAll(filter: Partial<T>, projection?: string | object): Promise<T[] | null> {
    try {
      const documents = await this._model.find(filter, projection).exec();
      return documents;
    } catch (error) {
      logger.error("Error finding document:", error);
      throw error;
    }
  }

  async updateOne(filter: Partial<T>, updateData: Partial<T>): Promise<T | null> {
    try {
      const updatedDocument = await this._model
        .findOneAndUpdate(filter, { $set: updateData }, { new: true })
        .exec();

      return updatedDocument;
    } catch (error) {
      logger.error("Error updating document:", error);
      throw error;
    }
  }

  async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
    try {
      const updatedDocument = await this._model
        .findByIdAndUpdate(id, { $set: updateData }, { new: true })
        .exec();

      return updatedDocument;
    } catch (error) {
      logger.error("Error updating document by ID:", error);
      throw error;
    }
  }

  async deleteOne(filter: Partial<T>): Promise<T | null> {
    try {
      const deletedDocument = await this._model.findOneAndDelete(filter).exec();
      return deletedDocument;
    } catch (error) {
      logger.error("Error deleting document:", error);
      throw error;
    }
  }

  async deleteMany(filter: Partial<T>): Promise<number> {
    try {
      const deleted = await this._model.deleteMany(filter).exec();
      return deleted.deletedCount || 0;
    } catch (error) {
      logger.error("Error deleting many document:", error);
      throw error;
    }
  }

  // async findPaginated(
  //   baseFilter: Partial<T>,
  //     page: number,
  //     limit: number,
  //     search?: string,
  //     searchFields?: (keyof T)[],
  // sort?: SortOption<T> | { [key: string]: 1 | -1 }  ): Promise<PaginatedResponse<T>> {
  //       try {
  //         logger.debug("baseFilter in findpaginated ",{baseFilter});
  //     const query: FilterQuery<T> = {...baseFilter} as any;

  //     if (search && searchFields?.length) {
  //       query.$or = searchFields.map(field => ({
  //         [field]: { $regex: search, $options: "i" }
  //       })) as any;
  //     }

  //     const totalItems = await this._model.countDocuments(query);
  //     const totalPages = Math.ceil(totalItems / limit);
  //     const hasNext = page < totalPages;
  //     const hasPrev = page > 1;

  //     const sortOption = sort && Object.keys(sort).length ? sort : { date: -1 };

  //     const data = await this._model
  //       .find(query)
  //       .skip((page - 1) * limit)
  //       .limit(limit)
  // .sort(sortOption as any)
  // .select('-password');
  //     return {
  //       data,
  //       pagination: {
  //         page,
  //         limit,
  //         totalItems,
  //         totalPages,
  //         hasNext,
  //         hasPrev
  //       }
  //     };
  //       } catch (error) {
  //     logger.error(`Error in findPaginated data: ${error}`);
  //     throw error;
  //   }
  //   }

  async findPaginated(
    baseFilter: FilterQuery<T>,
    page = 1,
    limit = 10,
    search?: string,
    searchFields?: (keyof T)[],
    sort?: SortOption<T>
  ): Promise<PaginatedResponse<T>> {
    try {
      const query: FilterQuery<T> = { ...baseFilter };

      /* ----------------------------- SEARCH LOGIC ---------------------------- */
      if (search && searchFields?.length) {
        query.$or = searchFields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        })) as any;
      }

      /* ---------------------------- PAGINATION DATA --------------------------- */
      const safePage = Math.max(page, 1);
      const safeLimit = Math.max(limit, 1);
      const skip = (safePage - 1) * safeLimit;

      const [data, totalItems] = await Promise.all([
        this._model
          .find(query)
          .sort(sort as any)
          .skip(skip)
          .limit(safeLimit)
          .exec(),

        this._model.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalItems / safeLimit);

      return {
        data,
        pagination: {
          page: safePage,
          limit: safeLimit,
          totalItems,
          totalPages,
          hasNext: safePage < totalPages,
          hasPrev: safePage > 1,
        },
      };
    } catch (error) {
      logger.error("BaseRepository.findPaginated error", error);
      throw error;
    }
  }
}
