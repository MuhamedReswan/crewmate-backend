//sucess handler
export const responseHandler = (message: string, statusCode:number, data?: any) => {
    return { message, statusCode:statusCode, data: data || null };
};