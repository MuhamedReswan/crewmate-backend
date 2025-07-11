import jwt from 'jsonwebtoken';
import { ACCESSTOKENSECRET, REFRESHTOKENSECRET } from '../config/env';
import { UnAuthorizedError } from './errors/unAuthorized.error';
import { CreateToken, JwtPayload } from '../types/type';
import logger from './logger.util';


const accessTokenSecret = ACCESSTOKENSECRET; 
const refreshTokenSecret = REFRESHTOKENSECRET; 
console.log("accessTokenSecret",accessTokenSecret);
console.log("refreshTokenSecret",refreshTokenSecret);


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
            throw new Error('Refrsesh token secret in not defined');
        }
        console.log(" generateRefreshToken",refreshTokenSecret);

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
        logger.error("Failed to verify access token", error );
        return undefined;
    }
};


export const verifyRefreshToken = (token: string): JwtPayload => {
try {
    if(!refreshTokenSecret){
        throw new Error('Refrsesh token secret in not defined');
    }

    const decoded = jwt.verify(token, refreshTokenSecret) as JwtPayload;
    return decoded;
} catch (error) {
    console.log("verify refresh token error",error);
    throw new UnAuthorizedError('Invalid refresh token');
}
};


export const decodeRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    console.error("Failed to decode refresh token:", error);
    return null;
  }
};
