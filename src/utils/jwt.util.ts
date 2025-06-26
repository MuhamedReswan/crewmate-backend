import jwt from 'jsonwebtoken';
import { ACCESSTOKENSECRET, REFRESHTOKENSECRET } from '../config/env';
import { UnAuthorizedError } from './errors/unAuthorized.error';
import { CreateToken, JwtPayload } from '../types/type';
import { Role } from '../constants/Role';


const accessTokenSecret = ACCESSTOKENSECRET 
const refreshTokenSecret = REFRESHTOKENSECRET 
console.log("accessTokenSecret",accessTokenSecret)
console.log("refreshTokenSecret",refreshTokenSecret)


export const generateAccessToken = (details:CreateToken ) => {
    if(!accessTokenSecret){
        throw new Error('Access token secret is not defined');
    } 
    return jwt.sign({id:details.data?._id, email:details.data?.email,
 name: details.data?.name, role:details.role}, accessTokenSecret, {expiresIn: '50m'} );
};


export const generateRefreshToken = (details:CreateToken ) => {
    try {
        if(!refreshTokenSecret){
            throw new Error('Refrsesh token secret in not defined')
        }
        console.log(" generateRefreshToken",refreshTokenSecret)

        return jwt.sign({id:details.data?._id, email:details.data?.email,
            name: details.data?.name, role:details.role }, refreshTokenSecret, {expiresIn: '7d'} );
    } catch (error) {
        throw error;
    }

};


export const verifyAccessToken = (token: string): JwtPayload |undefined => {
    try {
        if(!accessTokenSecret){
            throw new Error('Access token secret is not defined');
        } 
        return jwt.verify(token, accessTokenSecret) as JwtPayload;
    } catch (error) {
        return undefined;
    }
};


export const verifyRefreshToken = (token: string): JwtPayload => {
try {
    if(!refreshTokenSecret){
        throw new Error('Refrsesh token secret in not defined')
    }
        //   const tested = jwt.decode(token, { complete: true }) as JwtPayload;
        //   console.log("rrrrrrrrrrrrrrrrrrrrrr",tested);
        //   console.log(" verifyRefreshToken",refreshTokenSecret)

    
    const decoded = jwt.verify(token, refreshTokenSecret) as JwtPayload;
    return decoded;
} catch (error) {
    console.log("verify refresh token error",error)
    throw new UnAuthorizedError('Invalid refresh token')
}
};
