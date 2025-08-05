import { Model } from 'mongoose';
import { injectable } from 'tsyringe';
import { IBaseRepository } from '../../interfaces/base/IBase.repository';

@injectable()
export  class BaseRepository <T> implements IBaseRepository<T> {
  constructor(private _model: Model<T>) {} 

  async create(data: Partial<T>): Promise<T> {
    try {
       const createdDocument= await this._model.create(data);
      return  createdDocument;
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
};


async findOne(filter: Partial<T>): Promise<T | null> {
  try {
      const document = await this._model.findOne(filter).exec();
      return document;
  } catch (error) {
      console.error("Error finding document:", error);
      throw error;
  }
};

async findAll(filter: Partial<T>): Promise<T[] | null> {
  try {
      const documents = await this._model.find(filter).exec();
      return documents;
  } catch (error) {
      console.error("Error finding document:", error);
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
      console.error("Error updating document:", error);
      throw error;
  }
};


async deleteOne(filter: Partial<T>): Promise<T | null> {
  try {
    const deletedDocument = await this._model.findOneAndDelete(filter).exec();
    return deletedDocument;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};


async deleteMany(filter:Partial<T>): Promise<Number> {
  try {
    const deleted = await this._model.deleteMany(filter).exec();
return deleted.deletedCount || 0;
  } catch (error) {
    console.error("Error deleting many document:", error);
    throw error; 
  };

}
}