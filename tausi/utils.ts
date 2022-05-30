import mongoose from "mongoose";

const connection = async ()=> {

    await mongoose.connect('mongodb://localhost/test');
    
}

export {connection};