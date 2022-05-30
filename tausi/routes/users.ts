import express,{Request,Response,NextFunction}  from 'express';
import { userModel } from '../models/users';

let router = express.Router();

/* GET users listing. */
router.get('/', (req:Request, res:Response, next:NextFunction)=>{
  res.send('respond with a resource');
});

router.post('/register',async (req:Request, res:Response, next:NextFunction)=>{
  try {
  
    // console.log(req.body)
    var user = new userModel(req.body);
    await user.save()
    
    res.status(200).json(
      {"success":true,"return":0}
    )
  } catch (error) {
    next(error)
  }
})

router.post('')


export {router as usersRouter};
