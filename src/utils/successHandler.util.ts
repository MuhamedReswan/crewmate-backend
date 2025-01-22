//sucess handler
export const handleSuccess = (message: string, data?: any) => {
    return { message, data: data || null };
};