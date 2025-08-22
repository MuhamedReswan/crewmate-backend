import { FilterQuery, Model } from 'mongoose';
import { injectable } from 'tsyringe';
import { IBaseRepository } from '../../interfaces/base/IBase.repository';
import { PaginatedResponse } from '../../../../types/pagination.type';
import logger from '../../../../utils/logger.util';

@injectable()
export  class BaseRepository <T> implements IBaseRepository<T> {
  constructor(private _model: Model<T>) {} 

  async create(data: Partial<T>): Promise<T> {
    try {
       const createdDocument= await this._model.create(data);
      return  createdDocument;
    } catch (error) {
        logger.error("Error creating document:", error);
        throw error;
    }
};


async findOne(filter: Partial<T>): Promise<T | null> {
  try {
      const document = await this._model.findOne(filter).exec();
      return document;
  } catch (error) {
      logger.error("Error finding document:", error);
      throw error;
  }
};

async findAll(filter: Partial<T>): Promise<T[] | null> {
  try {
      const documents = await this._model.find(filter).exec();
      return documents;
  } catch (error) {
      logger.error("Error finding document:", error);
      throw error;
  }
};


async updateOne(filter: Partial<T>, updateData: Partial<T>): Promise<T | null> {
  try {
      const updatedDocument = await this._model.findOneAndUpdate(
          filter, 
         { $set: updateData }, 
          { new: true } 
      ).exec();

      return updatedDocument;
  } catch (error) {
      logger.error("Error updating document:", error);
      throw error;
  }
};


async deleteOne(filter: Partial<T>): Promise<T | null> {
  try {
    const deletedDocument = await this._model.findOneAndDelete(filter).exec();
    return deletedDocument;
  } catch (error) {
    logger.error("Error deleting document:", error);
    throw error;
  }
};


async deleteMany(filter:Partial<T>): Promise<Number> {
  try {
    const deleted = await this._model.deleteMany(filter).exec();
return deleted.deletedCount || 0;
  } catch (error) {
    logger.error("Error deleting many document:", error);
    throw error; 
  };
}



async findPaginated(
    page: number,
    limit: number,
    search?: string,
    isBlocked?:boolean,
    searchFields?: (keyof T)[]
  ): Promise<PaginatedResponse<T>> {
      try {
    const query: FilterQuery<T> = {} as any;

    if (search && searchFields?.length) {
      query.$or = searchFields.map(field => ({
        [field]: { $regex: search, $options: "i" }
      })) as any;
    }
    
if (typeof isBlocked === "boolean") {
  (query as Record<string, any>).isBlocked = isBlocked;
}
    const totalItems = await this._model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const data = await this._model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      }
    };
      } catch (error) {
    logger.error(`Error in findPaginated data: ${error}`);
    throw error;
  }
  }
}