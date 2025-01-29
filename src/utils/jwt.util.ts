import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESSTOKENSECRET, REFRESHTOKENSECRET } from '../config/env';
import { UnAuthorizedError } from './errors/unAuthorized.error';
import { CreateToken } from './type';


const accessTokenSecret = ACCESSTOKENSECRET 
const refreshTokenSecret = REFRESHTOKENSECRET 


export const generateAccessToken = (details:CreateToken ) => {
    if(!accessTokenSecret){
        throw new Error('Access token secret is not defined');
    } 
    return jwt.sign({id:details.data?._id, email:details.data?.email,
 name: details.data?.name, role:details.role}, accessTokenSecret, {expiresIn: '50m'} );
};


export const generateRefreshToken = (details:CreateToken ) => {
    if(!refreshTokenSecret){
        throw new Error('Refrsesh token secret in not defined')
    }
    return jwt.sign({id:details.data?._id, email:details.data?.email,
        name: details.data?.name, role:details.role}, refreshTokenSecret, {expiresIn: '7d'} );
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
    const decoded = jwt.verify(token, refreshTokenSecret) as JwtPayload;
    return decoded;
} catch (error) {
    throw new UnAuthorizedError('Invalid refresh token')
}
};
