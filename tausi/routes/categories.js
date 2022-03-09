var express = require('express');
const { categoryModel } = require('../models/categories');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add',async (res,req,next)=>{
  try {

    let category = res.body;
    // console.log(category)
    let data = new categoryModel(category);
    await data.save()
    
    req.json(
      {"success":true,"return":0}
    );
  } catch (error) {
    next(error)
  }
})

router.post('')
module.exports = router;
