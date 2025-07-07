import logger from "./logger.util";

//sucess handler
export const responseHandler = (message: string, statusCode:number, data?: any) => {
    logger.info("data in responseHandler",{data});
    return { message, statusCode:statusCode, data: data || null };
};