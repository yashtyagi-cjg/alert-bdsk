var passport = require('passport')
var LocalStrategy = require('passport-local');
var Auth = require('./../models/auth')
const validatePassword = require('./../utils/passportUtils')

passport.use(new LocalStrategy(async function verify(username, password, cb){
    var user = await Auth.findOne({username: username}).populate('clientId').exec().catch((err)=>{
        return cb(err);
    })

    if(!user){
        return cb(null, false, {message: 'Incorrect username or password'});
    }

    const valid = validatePassword(password, user.hash, user.salt); 

    if(valid){
        return cb(null, user)
    }else{
        return cb(null, false, {message: 'Incorrect username or password'});
    }
}))

passport.serializeUser(async function (user, cb){
    return cb(null, user._id);
})

passport.deserializeUser(async function(userId, cb){
    try{
        const user = await Auth.findById(userId).populate('clientId').exec();
        return cb(null, user);
    }catch(err){
        console.error(`Error occurred during deserialization: ${err}`);
        return cb(err)
    }
})