import jwt from 'jsonwebtoken';
import User from '../schemas/users';
import bcrypt from 'bcrypt';


/**
 * Use email as login, use password as password
 * @param {string} email 
 * @param {string} password
 */

 const expiresIn = '1d' // TIEMPO DE EXPIRACION
 const secret = 'samplesamplesample' // SECRET KEY
 const tokenPrefix = 'JWT' // PREFIX para EL HEADER DE HTTP

 export const createToken = (email, password) => {
     if(!email || !password){//SI NO HAY CREDENCIALES FALLA
         return false
     }
     const user = User.findOne({'email':email}).then((user)=>{
         
        const compare = new Promise((resolve,reject)=>{
            bcrypt.compare(password, user.password, function(err,res){
                if(res){
                    const payload ={
                        email: user.email,
                        id: user._id
                    }
                    const token = jwt.sign(payload,secret,{
                        expiresIn
                    })
       
                    resolve(token)
                }
                else{
                    reject(false)
                }
            })
        })
        return compare
     }).catch()

     return user
 }