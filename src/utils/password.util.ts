const bcrypt = require('bcrypt');

export async function hashPassword(password:string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hashed Password:', hashedPassword);
        return hashedPassword;
}



export async function verifyPassword(plaintextPassword: string,hashedPassword: string)
: Promise<boolean> {
        const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
        return isMatch;  
}
