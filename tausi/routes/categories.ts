import express,{Request,Response,NextFunction} from 'express'
import catergoryModel from "../models/categories";

const categoriesRouter:express.IRouter = express.Router();

/* GET users listing. */
categoriesRouter.get('/', function(req:Request,res:Response,next:NextFunction) {
  res.send('respond with a resource');
});

categoriesRouter.post('/add',async (req:Request,res:Response,next:NextFunction)=>{
  try {

    let category = req.body;
    // console.log(category)
    let data = new catergoryModel(category);
    // let data = new 
    await data.save()
    
    res.json(
      {"success":true,"return":0}
    );
  } catch (error) {
    next(error)
  }
})


export {categoriesRouter};
