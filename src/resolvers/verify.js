import User from '../schemas/users';
import jwt from 'jsonwebtoken';

/**
 * @returns {Object}- current user object
 * @param {string} token header
 */


const secret = 'samplejwtauthgraphql' // secret key
const tokenPrefix = 'JWT' // Prefix for HTTP header

export const verifyToken = async (token) =>{
    return new Promise((resolve,reject) => {
        const [prefix,payload] = token.split(' ');

        if(!payload) return reject('No token Provided');
        if(prefix !== tokenPrefix) return reject('Invalid header format');

        jwt.verify(payload, secret, (err,data)=>{
            if(err){
                return reject(err);
            }
            User.findOne({'_id':data.id}).exec()
                .then(res =>{
                    return resolve(res);
                })
                .catch(err => {
                    return reject(err);
                })
        })
    })
}