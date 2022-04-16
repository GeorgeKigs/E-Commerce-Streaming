var express = require('express');
var userModel = require('../models/users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async (res,req,next)=>{
  try {
  
    console.log(res.body)
    // var user = new userModel(res.body);
    // await user.save()
    
    req.status(200).json(
      {"success":true,"return":0}
    )
  } catch (error) {
    next(error)
  }
})

router.post('')
module.exports = router;
