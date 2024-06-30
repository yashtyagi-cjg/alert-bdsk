const Auth = require('./../models/auth')
const asyncHandler = require('express-async-handler');
const generatePassword = require('./../utils/passportUtils')


exports.signup = asyncHandler(
    async(req, res, next)=>{
        const resultPass = generatePassword(req.body.password);

        const auth = new Auth({
            username: req.body.username,
            salt: resultPass.salt,
            hash: resultPass.hash
        })

        await auth.save().then(()=>
            {
                console.log(`${username}: Created successfullly`);
                return res.status(200).json({message: "User created successfuly"});
            }
        ).catch((err)=>{
            console.log(`${req.body.username}: Encountered error during signup`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({message: "Error encountered during sign up"});
        })
    }
)


exports.logout = async(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
    })

    res.redirect('/')
}