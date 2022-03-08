var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add',async (res,req,next)=>{
  try {
    console.log(res.body);

    req.json(
      {"success":true,"return":0}
    );
  } catch (error) {
    next(error)
  }
})

router.post('')
module.exports = router;
