import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESSTOKENSECRET, REFRESHTOKENSECRET } from '../config/env';
import { UnAuthorizedError } from './errors/unAuthorized.error';
import { IServiceBoyLoginResponse } from '../services/v1/interfaces/IServiceBoyService';


const accessTokenSecret = ACCESSTOKENSECRET 
const refreshTokenSecret = REFRESHTOKENSECRET 


export const generateAccessToken = (data: IServiceBoyLoginResponse, role:string ) => {
    if(!accessTokenSecret){
        throw new Error('Access token secret is not defined');
    } 
    return jwt.sign({id:data.serviceBoy._id, email: data.serviceBoy.email,
 name: data.serviceBoy.name, role: role}, accessTokenSecret, {expiresIn: '50m'} );
};


export const generateRefreshToken = (data: IServiceBoyLoginResponse, role:string ) => {
    if(!refreshTokenSecret){
        throw new Error('Refrsesh token secret in not defined')
    }
    return jwt.sign({id:data.serviceBoy._id, email: data.serviceBoy.email,
         name: data.serviceBoy.name, role: role}, refreshTokenSecret, {expiresIn: '7d'} );
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
