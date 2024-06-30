var express = require('express');
var router = express.Router();


function ensureAuthentication(req, res, next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/')
  }

}



router.post('/', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/'
}));


router.use(ensureAuthentication);

//All protected Routes to be written below this
module.exports = router;
