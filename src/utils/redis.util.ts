import { createClient } from "redis";
import { REDISURL } from "../config/env";

const redisClient = createClient({
  url: REDISURL,
});

redisClient.on("error", (err) => { 
  console.error("Redis Client Error", err)
});

redisClient.on("connect", () => {
  console.log("Connected to Redis event");
});

redisClient.connect().catch((err) => {
  console.log('Redis connection error:', err);
});


export const setRedisData = async (key:string, value:string, ttl?:number) => {
  try {
    if(ttl){
      await redisClient.setEx(key,ttl,value);
    } else{
      await redisClient.set(key, value);
    }
console.log(`Data for ${key} saved successfully`);
return true
  } catch (error) {
    console.error(`Error saving data for ${key}:`, error);
    return false
  }
};


export const getRedisData = async (key: string): Promise<string | null> => {
  try {
      const data = await redisClient.get(key);
      return data;
  } catch (error) {
      console.error(`Error retrieving data for ${key}:`, error);
      return null;
  }
};


export const deleteRedisData = async (key: string) => {
  try {
      await redisClient.del(key);
      console.log(`Data for ${key} deleted successfully`);
  } catch (error) {
      console.error(`Error deleting data for ${key}:`, error);
  }
};

export default redisClient;