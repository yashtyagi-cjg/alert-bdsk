var crypto = require('node:crypto');


function generatePassword(password){
    var salt = crypto.randomBytes(32).toString('hex');
    var passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

    return {
        salt: salt,
        hash: passwordHash,
    }
}

function validatePassword(password, hash, salt){
    var challengeHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

    return challengeHash === hash;
}


module.exports = {
    generatePassword,
    validatePassword
}