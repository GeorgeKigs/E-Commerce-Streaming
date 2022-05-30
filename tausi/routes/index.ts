import express,{Request,Response,NextFunction}  from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', (req:Request, res:Response, next:NextFunction)=>{
  res.render('index', { title: 'Express' });
});



export {router as indexRouter};
