import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    'name': {
        type : String,
        require: true
    },
    'lastName': {
        type: String,
        require: true
    },
    'email': {
        type: String,
        require: true
    },
    'password': {
        type: String,
        require:true
    },
    'birthDate': {
        type: Date,
        require: false,
        ref: ''
    },
    'phone': {
        type: String,
        require: true
    },
    'isPremium':{
        type: Boolean,
        default: false,
        require: false
    },
},{'collection' : 'users',timestamps: true});

UserSchema.pre('save', function(next){
    var user = this;

    // solo modificamos la contraseñña si se ha modificado o es nueva
    if(!user.isModified('password')) return next();

    //GENERAMOS UN SALT
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
        if (err) return next(err);

        //hasheamos la contraseña usando el nuevo salt
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) return next(err);

            //hacemos un override de la contraseña con la nueva hasheada
            user.password = hash;
            next();
        })
    })
});

UserSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null,isMatch);
    });
};

export default mongoose.model('users',UserSchema);


